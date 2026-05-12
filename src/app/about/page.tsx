import type { Metadata } from "next";
import Link from "next/link";

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
        <div className="container">
          <h1
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            About iownchatgpt
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Building practical, replayable browser games with useful player guides
          </p>

          <div className="max-w-[800px] mx-auto space-y-6">
            <div className="content-block">
              <h2>Our Mission</h2>
              <p>
                To revolutionize arcade gaming by leveraging artificial intelligence
                to create innovative, engaging, and freely accessible games for
                everyone.
              </p>
            </div>

            <div className="content-block">
              <h2>Our Vision</h2>
              <p>
                A world where everyone can enjoy high-quality browser games
                instantly. We believe gaming should be accessible, free, and easy
                to understand for all players.
              </p>
            </div>

            <div className="content-block">
              <h2>Our Story</h2>
              <p>
                iownchatgpt was founded to publish lightweight browser games people
                can actually play and replay without downloads, account walls, or
                complicated setup. We focus on clear controls, fast loading, and
                simple match flow.
              </p>
              <p>
                Beyond game pages, we maintain guide content that explains strategy,
                host flow, and common mistakes. This turns the site into a usable
                gaming resource rather than a collection of empty launch pages.
              </p>
            </div>

            <div className="content-block">
              <h2>Our Values</h2>
              <ul>
                <li>
                  <strong>Clarity:</strong> We write instructions that are easy to
                  apply during real gameplay
                </li>
                <li>
                  <strong>Accessibility:</strong> Games should be free and available
                  to everyone, everywhere
                </li>
                <li>
                  <strong>Quality:</strong> We maintain high standards in all our
                  creations
                </li>
                <li>
                  <strong>Community:</strong> We listen to player feedback and
                  suggestions
                </li>
              </ul>
            </div>

            <div className="content-block">
              <h2>Why Choose iownchatgpt?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-24)] mt-4">
                {[
                  {
                    icon: "\uD83E\uDD16",
                    title: "Original Game Builds",
                    desc: "Every playable version is maintained directly on this site",
                  },
                  {
                    icon: "\uD83C\uDF89",
                    title: "Completely Free",
                    desc: "No subscriptions, no payments, no hidden costs",
                  },
                  {
                    icon: "\u26A1",
                    title: "Instant Access",
                    desc: "Play directly in your browser, no downloads required",
                  },
                  {
                    icon: "\uD83D\uDCF1",
                    title: "Cross-Platform",
                    desc: "Works on desktop, tablet, and mobile devices",
                  },
                ].map((item) => (
                  <div key={item.title} className="text-center p-4">
                    <div className="text-[48px] mb-[var(--space-8)]">
                      {item.icon}
                    </div>
                    <h3 className="text-white mb-[var(--space-4)]">
                      {item.title}
                    </h3>
                    <p className="text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-block text-center">
              <h2>Ready to Play?</h2>
              <p>
                Explore our collection of browser arcade games and use our guides
                to improve quickly.
              </p>
              <Link href="/games" className="btn-gradient mt-4 inline-block">
                Browse Games
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
