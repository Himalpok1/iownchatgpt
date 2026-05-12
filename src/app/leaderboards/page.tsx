import type { Metadata } from "next";
import Link from "next/link";
import { db, scores, games, users } from "@/lib/db";
import { eq, desc, sql } from "drizzle-orm";
import { games as gamesRegistry } from "@/lib/games";

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
        <div className="container">
          <h1
            className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section"
            style={{ fontWeight: "var(--font-weight-bold)" }}
          >
            Global Leaderboards
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Top scores across all games. Sign up to compete!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGames.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}/leaderboard`}
                className="card-glass p-6 no-underline transition-transform"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[40px]">{game.icon}</span>
                  <div>
                    <h3 className="text-white text-[var(--font-size-xl)] font-[var(--font-weight-semibold)]">
                      {game.name}
                    </h3>
                    <span className="text-[var(--color-gray-400)] text-sm">
                      {game.scoreCount.toLocaleString()} scores
                    </span>
                  </div>
                </div>

                {game.topScore !== null ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-[var(--font-size-3xl)] gradient-text"
                        style={{ fontWeight: "var(--font-weight-bold)" }}
                      >
                        {game.topScore.toLocaleString()}
                      </div>
                      {game.username && (
                        <div className="text-[var(--color-cyan)] text-[var(--font-size-lg)]">
                          @{game.username}
                        </div>
                      )}
                    </div>
                    <span className="badge text-xs">Top Score</span>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[var(--color-gray-400)] text-[var(--font-size-lg)] mb-2">
                      No scores yet
                    </p>
                    <span className="text-[var(--color-cyan)] text-[var(--font-size-lg)]">
                      Be the first! &rarr;
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
