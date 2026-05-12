import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/games";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Browse and play our growing collection of free browser arcade games. No downloads required.",
  alternates: { canonical: "https://iownchatgpt.com/games" },
};

export default function GamesPage() {
  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Games</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container">
          <h1
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Game Library
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Play our growing collection of quick, replayable games built for
            desktop and mobile.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--space-32)]">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="card-glass p-[var(--space-32)] text-center cursor-pointer no-underline transition-transform duration-[var(--duration-normal)]"
              >
                <div className="text-[80px] mb-[var(--space-16)]">
                  {game.icon}
                </div>
                <h3
                  className="text-[var(--font-size-3xl)] text-white mb-[var(--space-12)]"
                  style={{ fontWeight: "var(--font-weight-bold)" }}
                >
                  {game.title}
                </h3>
                <p className="text-[var(--font-size-lg)] text-[var(--color-gray-300)] mb-[var(--space-24)] leading-relaxed">
                  {game.description}
                </p>
                <span className="btn-gradient">Play Now</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
