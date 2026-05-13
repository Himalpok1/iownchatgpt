import { GoogleGenAI, Type } from "@google/genai";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, articleReviews, articleRuns, articleSources, articles, isDatabaseConfigured } from "@/lib/db";
import { collectEditorialSources, type EditorialSourceCandidate } from "@/lib/editorial/feeds";
import { sanitizeArticleHtml } from "@/lib/editorial/html";
import {
  defaultEditorialSettings,
  getCurrentEditorialSlot,
  getEditorialSettings,
  type EditorialSlotName,
} from "@/lib/editorial/settings";

const newsroomAuthor = "iownchatgpt News Desk";

const generationSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    seoTitle: { type: Type.STRING },
    seoDescription: { type: Type.STRING },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    disclosure: { type: Type.STRING },
    bodyHtml: { type: Type.STRING },
  },
  required: ["title", "summary", "seoTitle", "seoDescription", "keywords", "disclosure", "bodyHtml"],
};

export async function runEditorialGeneration(options?: {
  slot?: EditorialSlotName;
  triggeredBy?: string;
}) {
  if (!isDatabaseConfigured) {
    throw new Error("Editorial automation requires DATABASE_URL.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Editorial automation requires GEMINI_API_KEY.");
  }

  const settings = await getEditorialSettings();
  if (!settings.automationEnabled && options?.triggeredBy !== "admin") {
    throw new Error("Editorial automation is disabled.");
  }

  const slot = options?.slot ?? getCurrentEditorialSlot(settings);
  const runKey = `${new Date().toISOString().slice(0, 13)}-${slot}`;

  const [run] = await db
    .insert(articleRuns)
    .values({
      runKey,
      slot,
      status: "running",
      model: settings.model,
      triggeredBy: options?.triggeredBy ?? "scheduler",
    })
    .onConflictDoUpdate({
      target: articleRuns.runKey,
      set: {
        status: "running",
        model: settings.model,
        errorMessage: null,
        publishOutcome: null,
        completedAt: null,
      },
    })
    .returning();

  try {
    const usedUrls = await getPublishedSourceUrlsForCurrentDay();
    const sourcePool = await collectEditorialSources(settings);
    const selectedSources = pickMixedSources(sourcePool, usedUrls, settings.maxSourcesPerRun);

    if (selectedSources.length < 4) {
      throw new Error("Not enough fresh sources were available to build a roundup.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildEditorialPrompt(slot, selectedSources);
    const response = await ai.models.generateContent({
      model: settings.model || defaultEditorialSettings.model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: generationSchema,
        temperature: 0.45,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned no article payload.");
    }

    const generated = JSON.parse(response.text) as {
      title: string;
      summary: string;
      seoTitle: string;
      seoDescription: string;
      keywords: string[];
      disclosure: string;
      bodyHtml: string;
    };

    const slug = buildArticleSlug(generated.title, slot);
    const duplicateWarning = selectedSources.some((source) => usedUrls.includes(source.url));
    const heroImageUrl = `/api/editorial/cover?slug=${encodeURIComponent(slug)}&slot=${slot}`;

    const [article] = await db
      .insert(articles)
      .values({
        slug,
        title: generated.title.trim(),
        summary: generated.summary.trim(),
        bodyHtml: sanitizeArticleHtml(generated.bodyHtml),
        status: "published",
        articleType: "daily-roundup",
        category: "Daily Roundup",
        slot,
        keywords: generated.keywords.join(","),
        authorLabel: newsroomAuthor,
        disclosure: generated.disclosure.trim(),
        heroImageUrl,
        seoTitle: generated.seoTitle.trim(),
        seoDescription: generated.seoDescription.trim(),
        sourceCount: selectedSources.length,
        duplicateWarning,
        runId: run.id,
      })
      .onConflictDoUpdate({
        target: articles.slug,
        set: {
          title: generated.title.trim(),
          summary: generated.summary.trim(),
          bodyHtml: sanitizeArticleHtml(generated.bodyHtml),
          status: "published",
          category: "Daily Roundup",
          slot,
          keywords: generated.keywords.join(","),
          authorLabel: newsroomAuthor,
          disclosure: generated.disclosure.trim(),
          heroImageUrl,
          seoTitle: generated.seoTitle.trim(),
          seoDescription: generated.seoDescription.trim(),
          sourceCount: selectedSources.length,
          duplicateWarning,
          runId: run.id,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    await db.delete(articleSources).where(eq(articleSources.articleId, article.id));
    await db.insert(articleSources).values(
      selectedSources.map((source, index) => ({
        articleId: article.id,
        sourceUrl: source.url,
        sourceTitle: source.title,
        publisher: source.publisher,
        publishedAt: source.publishedAt,
        excerpt: source.excerpt,
        categoryTag: source.category,
        rank: index + 1,
      }))
    );

    await db
      .update(articleRuns)
      .set({
        status: "success",
        sourceCount: selectedSources.length,
        duplicateWarning,
        sourceSummary: selectedSources.map((source) => ({
          title: source.title,
          url: source.url,
          publisher: source.publisher,
          category: source.category,
        })),
        publishedSlug: article.slug,
        publishOutcome: "auto-published",
        completedAt: new Date(),
      })
      .where(eq(articleRuns.id, run.id));

    await db.insert(articleReviews).values({
      articleId: article.id,
      action: "auto-published",
      beforeStatus: null,
      afterStatus: "published",
      notes: `Generated from ${selectedSources.length} live sources during the ${slot} slot.`,
    });

    return { article, runId: run.id, sources: selectedSources };
  } catch (error) {
    await db
      .update(articleRuns)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown editorial failure",
        completedAt: new Date(),
      })
      .where(eq(articleRuns.id, run.id));

    throw error;
  }
}

export async function getEditorialDashboardData() {
  if (!isDatabaseConfigured) {
    return {
      settings: { ...defaultEditorialSettings, updatedAt: new Date() },
      articles: [],
      runs: [],
      stats: {
        publishedToday: 0,
        failedRuns: 0,
        needingAttention: 0,
      },
    };
  }

  const settings = await getEditorialSettings();
  const [recentArticles, recentRuns] = await Promise.all([
    db
      .select()
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(12),
    db
      .select()
      .from(articleRuns)
      .orderBy(desc(articleRuns.startedAt))
      .limit(12),
  ]);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [{ count: publishedToday }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(articles)
    .where(and(eq(articles.status, "published"), sql`${articles.publishedAt} >= ${startOfDay}`));

  const [{ count: failedRuns }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(articleRuns)
    .where(eq(articleRuns.status, "failed"));

  const [{ count: needingAttention }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(articles)
    .where(sql`${articles.duplicateWarning} = true OR ${articles.status} <> 'published'`);

  return {
    settings,
    articles: recentArticles,
    runs: recentRuns,
    stats: {
      publishedToday,
      failedRuns,
      needingAttention,
    },
  };
}

export function buildArticleSlug(title: string, slot: EditorialSlotName) {
  const datePrefix = new Date().toISOString().slice(0, 10);
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${datePrefix}-${slot}-${slug}`;
}

function buildEditorialPrompt(slot: EditorialSlotName, sources: EditorialSourceCandidate[]) {
  return `
You are the editorial automation system for iownchatgpt.com.
Write one polished daily news roundup article for the ${slot} publishing slot.

Requirements:
- Mix AI, Tech, Crypto, and adjacent consumer-device coverage in one coherent post.
- Use only the provided source list. Do not invent facts.
- Write in a practical, newsroom-style tone with clear transitions.
- Return valid JSON matching the schema.
- bodyHtml must include semantic HTML only: <p>, <h2>, <h3>, <ul>, <li>, <strong>, <a>.
- Include a short intro, grouped sections by topic, concise summaries, source links, and a final "Why this matters" section.
- Mention that the roundup was assembled from live web reporting at publish time.

Sources:
${sources
  .map(
    (source, index) => `
${index + 1}. [${source.category}] ${source.title}
Publisher: ${source.publisher}
Published: ${source.publishedAt?.toISOString() ?? "Unknown"}
URL: ${source.url}
Excerpt: ${source.excerpt}
    `.trim()
  )
  .join("\n\n")}
  `.trim();
}

function pickMixedSources(
  pool: EditorialSourceCandidate[],
  usedUrls: string[],
  maxSourcesPerRun: number
) {
  const unused = pool.filter((source) => !usedUrls.includes(source.url));
  const fallback = unused.length >= 5 ? unused : pool;
  const byCategory = new Map<string, EditorialSourceCandidate[]>();

  for (const source of fallback) {
    const current = byCategory.get(source.category) ?? [];
    current.push(source);
    byCategory.set(source.category, current);
  }

  const selected: EditorialSourceCandidate[] = [];
  const takeOrder: Array<EditorialSourceCandidate["category"]> = [
    "AI",
    "Tech",
    "Crypto",
    "Consumer Electronics",
    "AI",
    "Tech",
    "Crypto",
    "Consumer Electronics",
    "Tech",
  ];

  for (const category of takeOrder) {
    const next = byCategory.get(category)?.shift();
    if (next) {
      selected.push(next);
    }
    if (selected.length >= maxSourcesPerRun) break;
  }

  if (selected.length < maxSourcesPerRun) {
    for (const source of fallback) {
      if (!selected.find((item) => item.url === source.url)) {
        selected.push(source);
      }
      if (selected.length >= maxSourcesPerRun) break;
    }
  }

  return selected.slice(0, maxSourcesPerRun);
}

async function getPublishedSourceUrlsForCurrentDay() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const rows = await db
    .select({ sourceUrl: articleSources.sourceUrl })
    .from(articleSources)
    .innerJoin(articles, eq(articleSources.articleId, articles.id))
    .where(and(eq(articles.status, "published"), sql`${articles.publishedAt} >= ${startOfDay}`));

  return rows.map((row) => row.sourceUrl);
}
