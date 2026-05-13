import type { MetadataRoute } from "next";
import { games } from "@/lib/games";
import { getGeneratedBlogPosts } from "@/lib/editorial/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://iownchatgpt.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/games`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/editorial-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const gamePages: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const generatedArticles = await getGeneratedBlogPosts();
  const articlePages: MetadataRoute.Sitemap = generatedArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticPages, ...gamePages, ...articlePages];
}
