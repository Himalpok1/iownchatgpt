import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, Gamepad2, Globe, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About iownchatgpt",
  description:
    "Building practical, replayable browser games with useful player guides.",
  alternates: { canonical: "https://iownchatgpt.com/about" },
};

export default function AboutPage() {
  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">About Us</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container page-shell">
          <div className="page-hero">
            <div className="page-hero__header">
              <div>
                <p className="home-section__eyebrow">About</p>
                <h1 className="page-hero__title">A browser arcade with a real editorial backbone.</h1>
              </div>
              <p className="page-hero__copy">
                iownchatgpt started as a place for fast, replayable browser games and has grown
                into a product that treats guides, support, and now the AI newsroom as first-class
                parts of the experience.
              </p>
            </div>

            <div className="page-summary-grid">
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Built for</p>
                <div className="page-summary-card__value">
                  <Gamepad2 size={18} className="text-[var(--color-cyan)]" />
                  instant play sessions
                </div>
                <p className="page-summary-card__copy">
                  No downloads, no heavy onboarding, and no account wall before the fun starts.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Editorial layer</p>
                <div className="page-summary-card__value">
                  <BookOpenText size={18} className="text-[var(--color-cyan)]" />
                  guides plus live roundups
                </div>
                <p className="page-summary-card__copy">
                  Strategy guides, policy pages, and current tech coverage all live inside one product.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Audience</p>
                <div className="page-summary-card__value">
                  <Globe size={18} className="text-[var(--color-cyan)]" />
                  global, cross-device players
                </div>
                <p className="page-summary-card__copy">
                  The site is designed to stay lightweight and readable across desktop and mobile.
                </p>
              </div>
            </div>
          </div>

          <div className="page-two-col">
            <div className="guide-grid">
              <article className="surface-panel guide-card">
                <h2>Mission</h2>
                <p>
                  Build practical browser entertainment that people can return to easily, then
                  support it with clear writing that makes the whole experience more useful.
                </p>
              </article>

              <article className="surface-panel guide-card">
                <h2>What the site is now</h2>
                <p>
                  The product has three working layers: playable games, player-help content, and a
                  live editorial/newsroom system for AI, tech, crypto, and adjacent topics.
                </p>
                <p>
                  That means the site is no longer just a collection of launch links. It is a
                  maintained product with gameplay, rankings, support, policies, and publishing
                  controls that all belong to the same system.
                </p>
              </article>

              <article className="surface-panel guide-card">
                <h2>Why this approach matters</h2>
                <ul>
                  <li>Games are fast to try and easy to replay.</li>
                  <li>Guides explain the versions that actually live on this site.</li>
                  <li>Support and policy pages are treated like product surfaces, not afterthoughts.</li>
                  <li>The newsroom can publish current coverage without waiting for a redeploy.</li>
                </ul>
              </article>
            </div>

            <div className="home-stack">
              <aside className="surface-panel home-list-card">
                <h3>Values</h3>
                <ul>
                  <li>Clarity over filler.</li>
                  <li>Accessibility over friction.</li>
                  <li>Useful systems over flashy dead ends.</li>
                  <li>Human correction paths wherever automation exists.</li>
                </ul>
              </aside>

              <aside className="surface-panel home-list-card">
                <h3>Operational standards</h3>
                <p>
                  Gameplay should feel responsive, pages should load cleanly, and editorial content
                  should be understandable enough to trust or challenge.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[var(--color-cyan)]">
                  <ShieldCheck size={16} />
                  Policy and correction paths stay visible.
                </div>
              </aside>

              <aside className="surface-panel home-list-card">
                <h3>Jump in</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/games" className="btn-gradient">
                    Browse Games
                  </Link>
                  <Link href="/blog" className="btn-secondary">
                    Read the Blog
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
