import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Newspaper, Rss, Sparkles } from "lucide-react";
import { blogCategories } from "@/lib/blog";
import { getMergedBlogPosts } from "@/lib/editorial/articles";

export const metadata: Metadata = {
  title: "Blog",
  description: "Trending articles on AI, tech, crypto, and consumer electronics.",
  alternates: { canonical: "https://iownchatgpt.com/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCat } = await searchParams;
  const activeCategory =
    rawCat && blogCategories.includes(rawCat as (typeof blogCategories)[number])
      ? rawCat
      : "All";

  const filtered = await getMergedBlogPosts(activeCategory);

  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Blog</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container page-shell">
          <div className="page-hero">
            <div className="page-hero__header">
              <div>
                <p className="home-section__eyebrow">Editorial</p>
                <h1 className="page-hero__title">Reporting that still feels useful a week later.</h1>
              </div>
              <p className="page-hero__copy">
                Long-form coverage across AI, tech, crypto, and consumer electronics,
                written to be useful on its own and relevant to the site around it.
              </p>
            </div>

            <div className="page-summary-grid">
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Published</p>
                <div className="page-summary-card__value">{filtered.length} live articles</div>
                <p className="page-summary-card__copy">
                  A compact archive of trend-aware writing with practical takeaways.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Coverage</p>
                <div className="page-summary-card__value">
                  <Rss size={18} className="text-[var(--color-cyan)]" />
                  AI, Tech, Crypto, Consumer
                </div>
                <p className="page-summary-card__copy">
                  Broad enough to explore trends, tight enough to stay readable.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Editorial style</p>
                <div className="page-summary-card__value">
                  <Sparkles size={18} className="text-[var(--color-cyan)]" />
                  clear, practical, current
                </div>
                <p className="page-summary-card__copy">
                  Written for people who want signal instead of recycled takes.
                </p>
              </div>
            </div>
          </div>

          <div className="home-section__header mb-4">
            <div>
              <p className="home-section__eyebrow">Browse</p>
              <h2 className="text-white text-[1.3rem] font-[var(--font-weight-semibold)]">
                Filter by topic
              </h2>
            </div>
            <p className="home-section__copy">
              Long-form coverage across AI, tech, crypto, and consumer electronics,
              with a front page that stays scannable when you just want one good read.
            </p>
          </div>

          <div className="filter-row">
            {blogCategories.map((cat) => {
              const active = cat === activeCategory;
              const href = cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`filter-chip no-underline ${active ? "is-active" : ""}`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          <div className="article-grid">
                {filtered.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`card-glass article-card no-underline ${
                  index === 0 ? "article-card--featured" : ""
                }`}
              >
                <div className="article-card__meta">
                  <span className="badge w-fit text-xs">{post.category}</span>
                  <span className="text-xs text-[var(--color-gray-400)]">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="article-card__title font-[var(--font-weight-semibold)] mb-3">
                    {post.title}
                  </h3>
                  <p className={`article-card__copy ${index === 0 ? "" : "line-clamp-3"}`}>
                    {post.description}
                  </p>
                </div>
                <div className="article-card__footer">
                  <span className="inline-flex items-center gap-2 text-sm text-[var(--color-gray-400)]">
                    {index === 0 ? <BookOpenText size={14} /> : <Newspaper size={14} />}
                    {post.author}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm text-[var(--color-cyan)]">
                    Read article
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
