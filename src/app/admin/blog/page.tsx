import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3, Newspaper } from "lucide-react";
import { requireAdminSession } from "@/lib/admin";
import { getEditorialDashboardData } from "@/lib/editorial/service";
import { EditorialRunPanel } from "@/components/admin/EditorialRunPanel";
import { EditorialSettingsForm } from "@/components/admin/EditorialSettingsForm";

export const metadata: Metadata = {
  title: "Admin Newsroom",
};

export default async function AdminBlogPage() {
  await requireAdminSession();
  const dashboard = await getEditorialDashboardData();

  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Admin Newsroom</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container page-shell">
          <div className="page-hero">
            <div className="page-hero__header">
              <div>
                <p className="home-section__eyebrow">Admin</p>
                <h1 className="page-hero__title">Control the AI newsroom from one place.</h1>
              </div>
              <p className="page-hero__copy">
                Monitor scheduled runs, inspect sources, publish corrections, and tune the daily
                roundup system without editing code.
              </p>
            </div>
            <div className="page-summary-grid">
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Published today</p>
                <div className="page-summary-card__value">
                  <CheckCircle2 size={18} className="text-[var(--color-cyan)]" />
                  {dashboard.stats.publishedToday} posts
                </div>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Failed runs</p>
                <div className="page-summary-card__value">
                  <AlertCircle size={18} className="text-[var(--color-cyan)]" />
                  {dashboard.stats.failedRuns} runs
                </div>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Needs attention</p>
                <div className="page-summary-card__value">
                  <Clock3 size={18} className="text-[var(--color-cyan)]" />
                  {dashboard.stats.needingAttention} items
                </div>
              </div>
            </div>
          </div>

          <div className="home-stack mb-8">
            <EditorialSettingsForm settings={dashboard.settings} />
            <EditorialRunPanel />
          </div>

          <div className="page-two-col">
            <div className="surface-panel p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="home-section__eyebrow !mb-2">Recent articles</p>
                  <h2 className="text-white text-[1.1rem] font-[var(--font-weight-semibold)]">
                    Published and in review
                  </h2>
                </div>
                <Newspaper size={18} className="text-[var(--color-cyan)]" />
              </div>
              <div className="space-y-3">
                {dashboard.articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/blog/${article.id}`}
                    className="block rounded-[var(--radius-base)] border border-[rgba(148,163,184,0.14)] px-4 py-4 no-underline hover:border-[rgba(56,189,248,0.34)]"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="badge text-xs">{article.slot}</span>
                      <span className="text-xs text-[var(--color-gray-400)]">{article.status}</span>
                    </div>
                    <h3 className="text-white font-[var(--font-weight-semibold)] leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[var(--color-gray-300)] mt-2 line-clamp-2">
                      {article.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface-panel p-6">
              <p className="home-section__eyebrow !mb-2">Run history</p>
              <h2 className="text-white text-[1.1rem] font-[var(--font-weight-semibold)] mb-5">
                Scheduler activity
              </h2>
              <div className="space-y-3">
                {dashboard.runs.map((run) => (
                  <div
                    key={run.id}
                    className="rounded-[var(--radius-base)] border border-[rgba(148,163,184,0.14)] px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="badge text-xs">{run.slot}</span>
                      <span className="text-xs text-[var(--color-gray-400)]">{run.status}</span>
                    </div>
                    <p className="text-white font-[var(--font-weight-semibold)] mt-3">
                      {run.publishedSlug ?? "No article published"}
                    </p>
                    <p className="text-sm text-[var(--color-gray-300)] mt-2">
                      {run.errorMessage ?? `${run.sourceCount} sources, ${run.publishOutcome ?? "pending outcome"}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
