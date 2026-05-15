import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { db, articleSources, articles, isDatabaseConfigured } from "@/lib/db";
import { blogPosts, type BlogPost } from "@/lib/blog";

export interface GeneratedBlogPost extends BlogPost {
  id: number;
  bodyHtml: string;
  disclosure: string;
  heroImageUrl: string | null;
  sourceCount: number;
  duplicateWarning: boolean;
  isGenerated: true;
}

export type BlogFeedPost = BlogPost | GeneratedBlogPost;

export async function getGeneratedBlogPosts(limit?: number): Promise<GeneratedBlogPost[]> {
  if (!isDatabaseConfigured) return [];

  try {
    const query = db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt));

    const rows = limit ? await query.limit(limit) : await query;
    return rows.map(mapArticleToGeneratedPost);
  } catch {
    return [];
  }
}

export async function getGeneratedBlogPostBySlug(slug: string) {
  if (!isDatabaseConfigured) return null;
  try {
    const [row] = await db
      .select()
      .from(articles)
      .where(and(eq(articles.slug, slug), ne(articles.status, "archived")))
      .limit(1);

    return row ? mapArticleToGeneratedPost(row) : null;
  } catch {
    return null;
  }
}

export async function getGeneratedSourcesForArticle(articleId: number) {
  if (!isDatabaseConfigured) return [];
  try {
    return await db
      .select()
      .from(articleSources)
      .where(eq(articleSources.articleId, articleId))
      .orderBy(articleSources.rank);
  } catch {
    return [];
  }
}

export async function getMergedBlogPosts(category?: string): Promise<BlogFeedPost[]> {
  const generated = await getGeneratedBlogPosts();
  const staticPosts =
    category && category !== "All"
      ? blogPosts.filter((post) => post.category === category)
      : blogPosts;

  let mixed: BlogFeedPost[] = [...generated, ...staticPosts];

  if (category && category !== "All") {
    mixed = mixed.filter((post) => post.category === category);
  }

  return mixed.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getMergedBlogPostCount() {
  const generatedCount = (await getGeneratedBlogPosts()).length;
  return blogPosts.length + generatedCount;
}

export async function getUsedSourceUrlsForToday(): Promise<string[]> {
  if (!isDatabaseConfigured) return [];
  try {
    const todaysArticles = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.status, "published")));

    if (todaysArticles.length === 0) return [];

    const todaysIds = todaysArticles
      .filter((row) => row.id)
      .map((row) => row.id);

    if (todaysIds.length === 0) return [];

    const sources = await db
      .select({ sourceUrl: articleSources.sourceUrl })
      .from(articleSources)
      .innerJoin(articles, eq(articleSources.articleId, articles.id))
      .where(
        and(
          inArray(articleSources.articleId, todaysIds),
          eq(articles.status, "published")
        )
      );

    return sources.map((source) => source.sourceUrl);
  } catch {
    return [];
  }
}

function mapArticleToGeneratedPost(article: typeof articles.$inferSelect): GeneratedBlogPost {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.summary,
    date: article.publishedAt.toISOString(),
    category: article.category,
    keywords: article.keywords ?? "",
    author: article.authorLabel,
    bodyHtml: article.bodyHtml,
    disclosure: article.disclosure,
    heroImageUrl: article.heroImageUrl,
    sourceCount: article.sourceCount,
    duplicateWarning: article.duplicateWarning,
    isGenerated: true,
  };
}
