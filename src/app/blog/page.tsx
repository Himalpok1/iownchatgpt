import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, blogCategories } from "@/lib/blog";

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

  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

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
        <div className="container">
          <h1
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Trending Blog
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Long-form articles on AI, tech, crypto, and consumer electronics.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {blogCategories.map((cat) => {
              const active = cat === activeCategory;
              const href = cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all border no-underline ${
                    active
                      ? "bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-cyan)] text-white border-transparent"
                      : "border-[rgba(125,211,252,0.2)] text-[var(--color-gray-300)] hover:border-[var(--color-cyan)] hover:text-white"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-24)]">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-glass p-[var(--space-24)] no-underline flex flex-col transition-transform hover:-translate-y-1"
              >
                <span className="badge mb-3 inline-block text-xs w-fit">{post.category}</span>
                <h3 className="text-[var(--font-size-xl)] text-white mb-[var(--space-12)] font-[var(--font-weight-semibold)] leading-snug flex-1">
                  {post.title}
                </h3>
                <p className="text-[var(--color-gray-400)] text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[var(--color-gray-400)] text-xs">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="text-[var(--color-cyan)] text-sm">
                    Read &rarr;
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
