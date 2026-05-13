import type { EditorialSettingsRecord } from "@/lib/editorial/settings";

export type EditorialTopic = "AI" | "Tech" | "Crypto" | "Consumer Electronics";

export interface EditorialSourceCandidate {
  title: string;
  url: string;
  excerpt: string;
  publisher: string;
  publishedAt: Date | null;
  category: EditorialTopic;
  score: number;
}

interface FeedConfig {
  publisher: string;
  url: string;
  baseCategory: EditorialTopic;
  weight: number;
}

const feedConfigs: FeedConfig[] = [
  {
    publisher: "OpenAI News",
    url: "https://openai.com/news/rss.xml",
    baseCategory: "AI",
    weight: 1.2,
  },
  {
    publisher: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    baseCategory: "Tech",
    weight: 1,
  },
  {
    publisher: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    baseCategory: "Tech",
    weight: 1,
  },
  {
    publisher: "CoinDesk",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    baseCategory: "Crypto",
    weight: 1.1,
  },
];

const aiKeywords = ["ai", "artificial intelligence", "llm", "gpt", "model", "agent"];
const cryptoKeywords = ["crypto", "bitcoin", "ethereum", "token", "blockchain", "defi", "stablecoin"];
const consumerKeywords = ["laptop", "phone", "wearable", "smart home", "glasses", "device", "hardware"];

export async function collectEditorialSources(
  settings: EditorialSettingsRecord
): Promise<EditorialSourceCandidate[]> {
  const enabledTopics = new Set(
    settings.trackedTopics.map((topic) => topic.trim().toLowerCase())
  );

  const responses = await Promise.all(
    feedConfigs.map(async (feed) => {
      try {
        const response = await fetch(feed.url, {
          headers: {
            "User-Agent": "iownchatgpt-newsroom/1.0 (+https://iownchatgpt.com)",
          },
          next: { revalidate: 0 },
        });

        if (!response.ok) {
          throw new Error(`${feed.publisher} responded with ${response.status}`);
        }

        const xml = await response.text();
        return parseFeed(xml, feed);
      } catch (error) {
        console.error(`Editorial feed fetch failed for ${feed.publisher}:`, error);
        return [];
      }
    })
  );

  const deduped = dedupeCandidates(responses.flat());

  return deduped
    .filter((candidate) => enabledTopics.has(candidate.category.toLowerCase()))
    .sort((a, b) => b.score - a.score || compareDates(b.publishedAt, a.publishedAt))
    .slice(0, Math.max(settings.maxSourcesPerRun * 2, 18));
}

function parseFeed(xml: string, feed: FeedConfig): EditorialSourceCandidate[] {
  const itemBlocks = [
    ...(xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? []),
    ...(xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? []),
  ];

  return itemBlocks
    .map((block) => {
      const title = readTag(block, "title");
      const link = readTag(block, "link") || readAtomLink(block);
      const excerpt = stripHtml(readTag(block, "description") || readTag(block, "summary"));
      const publishedRaw =
        readTag(block, "pubDate") ||
        readTag(block, "published") ||
        readTag(block, "updated");
      const publishedAt = publishedRaw ? new Date(publishedRaw) : null;

      if (!title || !link) return null;

      const category = classifyCategory(`${title} ${excerpt}`, feed.baseCategory);

      return {
        title,
        url: normalizeUrl(link),
        excerpt,
        publisher: feed.publisher,
        publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
        category,
        score: scoreCandidate(title, excerpt, publishedAt, feed.weight, category),
      } satisfies EditorialSourceCandidate;
    })
    .filter((value): value is EditorialSourceCandidate => Boolean(value));
}

function readTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!match?.[1]) return "";
  return decodeEntities(stripCdata(match[1]).trim());
}

function readAtomLink(block: string) {
  const match = block.match(/<link[^>]+href="([^"]+)"[^>]*\/?>/i);
  return match?.[1] ?? "";
}

function stripCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
}

function stripHtml(value: string) {
  return decodeEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function classifyCategory(text: string, fallback: EditorialTopic): EditorialTopic {
  const haystack = text.toLowerCase();
  if (cryptoKeywords.some((keyword) => haystack.includes(keyword))) return "Crypto";
  if (consumerKeywords.some((keyword) => haystack.includes(keyword))) return "Consumer Electronics";
  if (aiKeywords.some((keyword) => haystack.includes(keyword))) return "AI";
  return fallback;
}

function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url.trim());
    parsed.hash = "";
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    return parsed.toString();
  } catch {
    return url.trim();
  }
}

function scoreCandidate(
  title: string,
  excerpt: string,
  publishedAt: Date | null,
  weight: number,
  category: EditorialTopic
) {
  const ageHours = publishedAt
    ? Math.max(1, (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60))
    : 12;
  const freshness = Math.max(0.15, 24 / (ageHours + 2));
  const titleBonus = title.length > 40 ? 0.2 : 0;
  const excerptBonus = excerpt.length > 120 ? 0.2 : 0;
  const categoryBonus = category === "AI" || category === "Crypto" ? 0.1 : 0;
  return Number((weight + freshness + titleBonus + excerptBonus + categoryBonus).toFixed(4));
}

function dedupeCandidates(candidates: EditorialSourceCandidate[]) {
  const seen = new Map<string, EditorialSourceCandidate>();

  for (const candidate of candidates) {
    const key = `${candidate.title.toLowerCase()}::${candidate.url}`;
    const existing = seen.get(key);
    if (!existing || candidate.score > existing.score) {
      seen.set(key, candidate);
    }
  }

  return [...seen.values()];
}

function compareDates(a: Date | null, b: Date | null) {
  return (a?.getTime() ?? 0) - (b?.getTime() ?? 0);
}
