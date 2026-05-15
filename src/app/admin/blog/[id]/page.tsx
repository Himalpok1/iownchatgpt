import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getAdminSessionState } from "@/lib/admin";
import { db, articleReviews, articleSources, articles } from "@/lib/db";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { EditorialArticleEditor } from "@/components/admin/EditorialArticleEditor";

export const metadata: Metadata = {
  title: "Edit Newsroom Article",
};

export default async function AdminBlogArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { session, isAuthenticated, isAdmin } = await getAdminSessionState();

  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  if (!isAdmin) {
    return <AdminAccessDenied email={session?.user?.email} />;
  }

  const { id } = await params;
  const articleId = Number(id);

  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1);

  if (!article) {
    return (
      <section className="content-section">
        <div className="container">
          <p className="text-[var(--color-gray-300)]">Article not found.</p>
        </div>
      </section>
    );
  }

  const [sources, reviews] = await Promise.all([
    db
      .select()
      .from(articleSources)
      .where(eq(articleSources.articleId, article.id))
      .orderBy(articleSources.rank),
    db
      .select()
      .from(articleReviews)
      .where(eq(articleReviews.articleId, article.id))
      .orderBy(desc(articleReviews.createdAt)),
  ]);

  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <Link href="/admin/blog">Admin Newsroom</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Edit Article</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container page-shell">
          <div className="page-two-col">
            <EditorialArticleEditor
              article={{
                id: article.id,
                title: article.title,
                summary: article.summary,
                bodyHtml: article.bodyHtml,
                heroImageUrl: article.heroImageUrl,
                status: article.status,
              }}
            />

            <div className="home-stack">
              <div className="surface-panel home-list-card">
                <h3>Source inspection</h3>
                <div className="grid gap-4 mt-4">
                  {sources.map((source) => (
                    <div key={source.id} className="rounded-[var(--radius-base)] border border-[rgba(148,163,184,0.14)] px-4 py-4">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="badge text-xs">{source.categoryTag}</span>
                        <span className="text-xs text-[var(--color-gray-400)]">{source.publisher}</span>
                      </div>
                      <h4 className="text-white font-[var(--font-weight-semibold)]">
                        {source.sourceTitle}
                      </h4>
                      <p className="text-sm text-[var(--color-gray-300)] mt-2">
                        {source.excerpt}
                      </p>
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-cyan)] text-sm mt-3 inline-block"
                      >
                        Open source
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-panel home-list-card">
                <h3>Review history</h3>
                <div className="grid gap-3 mt-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-[var(--radius-base)] border border-[rgba(148,163,184,0.14)] px-4 py-4">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="badge text-xs">{review.action}</span>
                        <span className="text-xs text-[var(--color-gray-400)]">
                          {new Date(review.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-gray-300)]">
                        {review.notes ?? "No notes recorded."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
