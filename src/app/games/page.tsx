import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
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
          <div className="home-section__header mb-8">
            <div>
              <p className="home-section__eyebrow">Library</p>
              <h1 className="home-section__title">Game library</h1>
            </div>
            <p className="home-section__copy">
              Browse the full shelf, jump into a title quickly, and use the
              leaderboard or guide paths when you want a little more structure
              than a one-off session.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
            <div className="surface-panel p-5">
              <p className="home-section__eyebrow !mb-2">Available now</p>
              <div className="text-2xl font-bold text-white">{games.length}</div>
              <p className="text-sm text-[var(--color-gray-300)]">
                games ready to play in the browser
              </p>
            </div>
            <div className="surface-panel p-5">
              <p className="home-section__eyebrow !mb-2">Leaderboards</p>
              <div className="text-2xl font-bold text-white">Live</div>
              <p className="text-sm text-[var(--color-gray-300)]">
                score tracking across supported titles
              </p>
            </div>
            <div className="surface-panel p-5">
              <p className="home-section__eyebrow !mb-2">Built for replay</p>
              <div className="inline-flex items-center gap-2 text-white font-semibold">
                <Trophy size={18} className="text-[var(--color-cyan)]" />
                quick sessions, clear loops
              </div>
            </div>
          </div>

          <div className="home-games-grid">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="game-card card-glass"
              >
                <div className="game-card__top">
                  <span className="game-card__emoji">{game.icon}</span>
                  <span className="badge">Play now</span>
                </div>
                <div>
                  <h3 className="game-card__title">{game.title}</h3>
                  <p className="game-card__copy">{game.description}</p>
                </div>
                <div className="game-card__footer">
                  <span>Open game</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
