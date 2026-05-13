import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog";
import { ArrowLeft, ArrowRight, BookOpenText, CalendarDays, Tag } from "lucide-react";
import {
  getGeneratedBlogPostBySlug,
  getGeneratedSourcesForArticle,
} from "@/lib/editorial/articles";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const generated = post ? null : await getGeneratedBlogPostBySlug(slug);
  const resolved = post ?? generated;
  if (!resolved) return {};

  return {
    title: resolved.title,
    description: resolved.description,
    keywords: resolved.keywords,
    authors: [{ name: resolved.author }],
    alternates: { canonical: `https://iownchatgpt.com/blog/${slug}` },
    openGraph: {
      type: "article",
      title: resolved.title,
      description: resolved.description,
      url: `https://iownchatgpt.com/blog/${slug}`,
      publishedTime: resolved.date,
      authors: [resolved.author],
      tags: resolved.keywords.split(","),
    },
    twitter: {
      card: "summary_large_image",
      title: resolved.title,
      description: resolved.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const generated = post ? null : await getGeneratedBlogPostBySlug(slug);
  const resolved = post ?? generated;
  if (!resolved) notFound();

  let PostContent: React.ComponentType | null = null;
  if (!generated) {
    try {
      const mod = await import(`@/content/blog/${slug}.mdx`);
      PostContent = mod.default;
    } catch {
      notFound();
    }
  }

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: resolved.title,
    description: resolved.description,
    author: { "@type": "Person", name: resolved.author },
    publisher: {
      "@type": "Organization",
      name: "iownchatgpt",
      url: "https://iownchatgpt.com",
    },
    datePublished: resolved.date,
    dateModified: resolved.date,
    mainEntityOfPage: `https://iownchatgpt.com/blog/${slug}`,
    articleSection: resolved.category,
    keywords: resolved.keywords,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://iownchatgpt.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://iownchatgpt.com/blog" },
      { "@type": "ListItem", position: 3, name: resolved.title, item: `https://iownchatgpt.com/blog/${slug}` },
    ],
  };

  const related = blogPosts
    .filter((p) => p.category === resolved.category && p.slug !== slug)
    .slice(0, 3);
  const generatedSources = generated
    ? await getGeneratedSourcesForArticle(generated.id)
    : [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <Link href="/blog">Blog</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)] truncate max-w-[200px]">{resolved.title}</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container article-shell">
          <header className="article-header">
            <div className="mb-4">
              <Link
                href={`/blog?category=${encodeURIComponent(resolved.category)}`}
                className="badge text-xs no-underline hover:opacity-80 transition-opacity"
              >
                <Tag size={12} />
                {resolved.category}
              </Link>
            </div>
            <h1 className="article-header__title">{resolved.title}</h1>
            <p className="article-header__copy">{resolved.description}</p>
            <div className="article-meta">
              <span className="inline-flex items-center gap-2">
                <BookOpenText size={14} />
                By {resolved.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={14} />
                {new Date(resolved.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          <hr className="article-divider" />

          <article className="prose-blog">
            {generated ? (
              <>
                {generated.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={generated.heroImageUrl}
                    alt={generated.title}
                    className="mb-8 rounded-[var(--radius-base)] border border-[rgba(148,163,184,0.18)]"
                  />
                ) : null}
                <div className="surface-panel p-5 mb-8">
                  <p className="text-sm text-[var(--color-gray-200)]">{generated.disclosure}</p>
                  {generated.duplicateWarning ? (
                    <p className="text-sm text-amber-300 mt-3">
                      Some sources may overlap with another roundup published today.
                    </p>
                  ) : null}
                </div>
                <div dangerouslySetInnerHTML={{ __html: generated.bodyHtml }} />
              </>
            ) : (
              PostContent ? <PostContent /> : null
            )}
          </article>

          {generatedSources.length > 0 ? (
            <>
              <hr className="article-divider" />
              <section>
                <h2 className="text-[var(--font-size-2xl)] text-white mb-6 font-[var(--font-weight-semibold)]">
                  Source Log
                </h2>
                <div className="home-stack">
                  {generatedSources.map((source) => (
                    <div key={source.id} className="surface-panel home-list-card">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="badge text-xs">{source.categoryTag}</span>
                        <span className="text-xs text-[var(--color-gray-400)]">
                          {source.publisher}
                        </span>
                      </div>
                      <h3 className="text-white text-[1rem] font-[var(--font-weight-semibold)] mb-2">
                        {source.sourceTitle}
                      </h3>
                      <p className="text-[var(--color-gray-300)] text-sm mb-3">
                        {source.excerpt}
                      </p>
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-cyan)] text-sm"
                      >
                        Open source
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          <hr className="article-divider" />

          {related.length > 0 && (
            <section>
              <h2 className="text-[var(--font-size-2xl)] text-white mb-6 font-[var(--font-weight-semibold)]">
                Related Articles
              </h2>
              <div className="related-grid">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="card-glass related-card no-underline hover:opacity-80 transition-opacity"
                  >
                    <span className="badge text-xs inline-flex w-fit">{r.category}</span>
                    <p className="text-white text-sm font-medium leading-snug">{r.title}</p>
                    <span className="inline-flex items-center gap-2 text-sm text-[var(--color-cyan)]">
                      Read next
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[var(--color-gray-400)] text-sm hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
