import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "Editorial Policy for iownchatgpt.com - how content is created, reviewed, and maintained.",
  alternates: { canonical: "https://iownchatgpt.com/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Editorial Policy</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section" style={{ fontWeight: "var(--font-weight-bold)" }}>
            Editorial Policy
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Last updated: February 18, 2026
          </p>

          <div className="max-w-[800px] mx-auto space-y-6">
            <div className="content-block">
              <h2>1. Purpose</h2>
              <p>iownchatgpt publishes free browser games and supporting articles designed to help people understand gameplay, improve strategy, and host better group sessions. This policy explains how content is created, reviewed, updated, and corrected so readers can evaluate quality and trustworthiness.</p>
            </div>
            <div className="content-block">
              <h2>2. Content Standards</h2>
              <p>We do not publish thin filler pages. Every published page should have a clear player benefit, such as instructions, tactical guidance, troubleshooting, or policy clarity.</p>
              <ul>
                <li>Articles must be specific to our live game versions.</li>
                <li>Advice should be actionable and testable during real gameplay.</li>
                <li>Headings and summaries should match the actual content.</li>
                <li>Pages should avoid misleading claims and keyword stuffing.</li>
              </ul>
            </div>
            <div className="content-block">
              <h2>3. Authorship and Review</h2>
              <p>Content is drafted and reviewed by the site owner/maintainer. Before publication, we run a practical review that checks rule accuracy, control descriptions, and user flow consistency across desktop and mobile where relevant.</p>
              <p>For guide pages, we verify that the instructions reflect the actual game behavior in the current release. If a game update changes mechanics, corresponding guide sections are revised.</p>
            </div>
            <div className="content-block">
              <h2>4. AI Use Disclosure</h2>
              <p>We use AI tools in two ways: to assist with drafting and to produce scheduled daily news roundups sourced from live web reporting. Those roundups are published automatically when the generation pipeline succeeds, and each one includes disclosure that it was assembled with AI assistance.</p>
              <p>Automated publication does not remove human control. We maintain an internal admin workflow for corrections, updates, takedowns, and source inspection after publication.</p>
            </div>
            <div className="content-block">
              <h2>5. Corrections Policy</h2>
              <p>If an article contains outdated instructions, incorrect claims, confusing language, or a misleading summary of a cited source, we correct it and update the &ldquo;Last updated&rdquo; date where meaningful. Material corrections are prioritized over cosmetic edits.</p>
              <p>To report a content issue, send details to <a href="mailto:mailme@himal.info.np">mailme@himal.info.np</a> with page URL and a short explanation of the problem.</p>
            </div>
            <div className="content-block">
              <h2>6. Monetization and Ad Transparency</h2>
              <p>Ads and monetization should not interfere with game controls or hide core content. We avoid deceptive placements, forced clicks, and misleading labels. Editorial decisions are made for reader usefulness first.</p>
              <ul>
                <li>No clickbait claims intended only to attract ad traffic.</li>
                <li>No copied pages published solely for search ranking.</li>
                <li>No source-free AI output presented as reported news.</li>
                <li>No automated article remains live if a material issue is found after publication.</li>
              </ul>
            </div>
            <div className="content-block">
              <h2>7. Scope and Ongoing Improvements</h2>
              <p>This policy applies to gameplay guides, policy pages, and informational content on iownchatgpt.com. We review this document during major site updates to keep it aligned with real publishing workflow and user needs.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
