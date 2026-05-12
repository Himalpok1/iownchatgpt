import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog";

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
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: `https://iownchatgpt.com/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `https://iownchatgpt.com/blog/${slug}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.keywords.split(","),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
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
  if (!post) notFound();

  // Dynamic import of MDX content
  let PostContent: React.ComponentType;
  try {
    const mod = await import(`@/content/blog/${slug}.mdx`);
    PostContent = mod.default;
  } catch {
    notFound();
  }

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "iownchatgpt",
      url: "https://iownchatgpt.com",
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `https://iownchatgpt.com/blog/${slug}`,
    articleSection: post.category,
    keywords: post.keywords,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://iownchatgpt.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://iownchatgpt.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://iownchatgpt.com/blog/${slug}` },
    ],
  };

  // Related posts: same category, different slug, max 3
  const related = blogPosts
    .filter((p) => p.category === post.category && p.slug !== slug)
    .slice(0, 3);

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
          <span className="text-[var(--color-gray-300)] truncate max-w-[200px]">{post.title}</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container max-w-[800px]">
          {/* Article header */}
          <header className="mb-10">
            <div className="mb-4">
              <Link
                href={`/blog?category=${encodeURIComponent(post.category)}`}
                className="badge text-xs no-underline hover:opacity-80 transition-opacity"
              >
                {post.category}
              </Link>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-[42px] text-white mb-4 leading-tight"
              style={{ fontWeight: "var(--font-weight-bold)" }}
            >
              {post.title}
            </h1>
            <p className="text-[var(--color-gray-300)] text-[var(--font-size-xl)] mb-6">
              {post.description}
            </p>
            <div className="flex items-center gap-6 text-[var(--color-gray-400)] text-sm">
              <span>By {post.author}</span>
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          <hr className="border-[rgba(125,211,252,0.12)] mb-10" />

          {/* MDX content */}
          <article className="prose-blog">
            <PostContent />
          </article>

          <hr className="border-[rgba(125,211,252,0.12)] mt-10 mb-8" />

          {/* Related posts */}
          {related.length > 0 && (
            <section>
              <h2
                className="text-[var(--font-size-2xl)] text-white mb-6"
                style={{ fontWeight: "var(--font-weight-semibold)" }}
              >
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="card-glass p-4 no-underline hover:opacity-80 transition-opacity"
                  >
                    <span className="badge text-xs mb-2 inline-block">{r.category}</span>
                    <p className="text-white text-sm font-medium leading-snug">{r.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8">
            <Link href="/blog" className="text-[var(--color-gray-400)] text-sm hover:text-white transition-colors">
              &larr; Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
