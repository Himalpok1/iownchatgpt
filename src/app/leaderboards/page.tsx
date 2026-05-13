import type { Metadata } from "next";
import Link from "next/link";
import { db, scores, games, users } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";
import { games as gamesRegistry } from "@/lib/games";
import { ArrowRight, BarChart3, Trophy, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Leaderboards",
  description:
    "See the top scores across all games on iownchatgpt. Compete and climb the rankings.",
  alternates: { canonical: "https://iownchatgpt.com/leaderboards" },
};

export const revalidate = 60; // revalidate every 60 seconds

interface TopScore {
  gameSlug: string;
  gameName: string;
  topScore: number;
  username: string | null;
  scoreCount: number;
}

async function getTopScoresPerGame(): Promise<TopScore[]> {
  try {
    const result = await db
      .select({
        gameSlug: games.slug,
        gameName: games.name,
        topScore: sql<number>`max(${scores.score})`,
        scoreCount: sql<number>`count(${scores.id})`,
      })
      .from(scores)
      .innerJoin(games, eq(scores.gameId, games.id))
      .groupBy(games.slug, games.name)
      .orderBy(desc(sql`max(${scores.score})`))
      .limit(20);

    // Get the username for each top score
    const topScores: TopScore[] = await Promise.all(
      result.map(async (row) => {
        const topUser = await db
          .select({ username: users.username })
          .from(scores)
          .innerJoin(users, eq(scores.userId, users.id))
          .innerJoin(games, eq(scores.gameId, games.id))
          .where(eq(games.slug, row.gameSlug))
          .orderBy(desc(scores.score))
          .limit(1);

        return {
          ...row,
          username: topUser[0]?.username ?? null,
        };
      })
    );

    return topScores;
  } catch {
    return [];
  }
}

export default async function LeaderboardsPage() {
  const topScores = await getTopScoresPerGame();

  // Merge with game registry so we show all games even if no scores yet
  const allGames = gamesRegistry.map((g) => {
    const scored = topScores.find((s) => s.gameSlug === g.slug);
    return {
      slug: g.slug,
      name: g.title,
      icon: g.icon,
      topScore: scored?.topScore ?? null,
      username: scored?.username ?? null,
      scoreCount: scored?.scoreCount ?? 0,
    };
  });

  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Leaderboards</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container page-shell">
          <div className="page-hero">
            <div className="page-hero__header">
              <div>
                <p className="home-section__eyebrow">Competition</p>
                <h1 className="page-hero__title">See where the best runs are landing.</h1>
              </div>
              <p className="page-hero__copy">
                Global leaderboards across the full game library. Every card below jumps into a
                per-game ranking page with the latest standings.
              </p>
            </div>

            <div className="page-summary-grid">
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Tracked games</p>
                <div className="page-summary-card__value">
                  <Trophy size={18} className="text-[var(--color-cyan)]" />
                  {allGames.length} scoreboards
                </div>
                <p className="page-summary-card__copy">
                  Each game has its own leaderboard view and top-score summary.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Competition style</p>
                <div className="page-summary-card__value">
                  <BarChart3 size={18} className="text-[var(--color-cyan)]" />
                  global high-score chase
                </div>
                <p className="page-summary-card__copy">
                  Great for quick sessions, repeat runs, and friendly bragging rights.
                </p>
              </div>
              <div className="surface-panel page-summary-card">
                <p className="page-summary-card__label">Who can climb</p>
                <div className="page-summary-card__value">
                  <UserRound size={18} className="text-[var(--color-cyan)]" />
                  any signed-in player
                </div>
                <p className="page-summary-card__copy">
                  If a board looks empty, that just means there is room to claim first place.
                </p>
              </div>
            </div>
          </div>

          <div className="home-section__header mb-6">
            <div>
              <p className="home-section__eyebrow">All boards</p>
              <h2 className="text-white text-[1.3rem] font-[var(--font-weight-semibold)]">
                Jump into a game-specific ranking
              </h2>
            </div>
            <p className="home-section__copy">
              Top scores update from the live database, with empty states that still make it clear
              what to play next.
            </p>
          </div>

          <div className="home-games-grid">
            {allGames.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}/leaderboard`}
                className="card-glass game-card no-underline"
              >
                <div className="game-card__top">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="game-card__emoji text-[24px]">{game.icon}</span>
                    <div className="min-w-0">
                      <h3 className="game-card__title">{game.name}</h3>
                      <span className="text-[var(--color-gray-400)] text-sm">
                        {game.scoreCount.toLocaleString()} scores submitted
                      </span>
                    </div>
                  </div>
                  <span className="badge text-xs">Rankings</span>
                </div>

                {game.topScore !== null ? (
                  <div>
                    <div>
                      <p className="text-sm text-[var(--color-gray-400)] mb-2">Current top score</p>
                      <div className="text-[2rem] gradient-text font-[var(--font-weight-bold)]">
                        {game.topScore.toLocaleString()}
                      </div>
                      {game.username && (
                        <div className="text-[var(--color-cyan)] text-[var(--font-size-lg)]">
                          @{game.username}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-1">
                    <p className="text-[var(--color-gray-400)] text-[var(--font-size-lg)] mb-2">
                      No scores yet
                    </p>
                    <span className="text-[var(--color-cyan)] text-[var(--font-size-lg)]">
                      Be the first to set the pace.
                    </span>
                  </div>
                )}

                <div className="game-card__footer">
                  <span>{game.topScore !== null ? "Open full leaderboard" : "Start the first run"}</span>
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
