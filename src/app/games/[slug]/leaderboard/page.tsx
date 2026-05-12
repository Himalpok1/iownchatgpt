import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, scores, games, users } from "@/lib/db";
import { games as gamesRegistry } from "@/lib/games";
import { LeaderboardTabs } from "@/components/games/LeaderboardTabs";

export async function generateStaticParams() {
  return gamesRegistry.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = gamesRegistry.find((g) => g.slug === slug);
  if (!game) return {};
  return {
    title: `${game.title} Leaderboard`,
    description: `Top scores for ${game.title} on iownchatgpt.com`,
    alternates: { canonical: `https://iownchatgpt.com/games/${slug}/leaderboard` },
  };
}

interface LeaderboardEntry {
  rank: number;
  score: number;
  createdAt: Date;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  image: string | null;
}

async function getLeaderboard(
  gameId: number,
  isAsc: boolean,
  period: string
): Promise<LeaderboardEntry[]> {
  try {
    const now = new Date();
    const periodFilter =
      period === "today"
        ? gte(scores.createdAt, new Date(now.getFullYear(), now.getMonth(), now.getDate()))
        : period === "week"
        ? gte(scores.createdAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
        : null;

    const whereClause = periodFilter
      ? and(eq(scores.gameId, gameId), periodFilter)
      : eq(scores.gameId, gameId);

    return await db
      .select({
        rank: sql<number>`rank() over (order by ${scores.score} ${isAsc ? sql`asc` : sql`desc`})`,
        score: scores.score,
        createdAt: scores.createdAt,
        username: users.username,
        name: users.name,
        avatarUrl: users.avatarUrl,
        image: users.image,
      })
      .from(scores)
      .innerJoin(users, eq(scores.userId, users.id))
      .where(whereClause)
      .orderBy(isAsc ? scores.score : desc(scores.score))
      .limit(50);
  } catch {
    return [];
  }
}

async function getUserRank(
  userId: string,
  gameId: number,
  isAsc: boolean,
  period: string
): Promise<number | null> {
  try {
    const now = new Date();
    const periodFilter =
      period === "today"
        ? gte(scores.createdAt, new Date(now.getFullYear(), now.getMonth(), now.getDate()))
        : period === "week"
        ? gte(scores.createdAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
        : null;

    // Get user's best score in this period
    const userBest = await db
      .select({ score: scores.score })
      .from(scores)
      .where(
        periodFilter
          ? and(eq(scores.gameId, gameId), eq(scores.userId, userId), periodFilter)
          : and(eq(scores.gameId, gameId), eq(scores.userId, userId))
      )
      .orderBy(isAsc ? scores.score : desc(scores.score))
      .limit(1);

    if (!userBest[0]) return null;

    const best = userBest[0].score;
    const betterCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(scores)
      .where(
        periodFilter
          ? and(
              eq(scores.gameId, gameId),
              isAsc ? sql`score < ${best}` : sql`score > ${best}`,
              periodFilter
            )
          : and(
              eq(scores.gameId, gameId),
              isAsc ? sql`score < ${best}` : sql`score > ${best}`
            )
      );

    return Number(betterCount[0]?.count ?? 0) + 1;
  } catch {
    return null;
  }
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-[22px]">🥇</span>;
  if (rank === 2) return <span className="text-[22px]">🥈</span>;
  if (rank === 3) return <span className="text-[22px]">🥉</span>;
  return (
    <span className="text-[var(--color-gray-400)] font-mono text-sm w-[28px] text-right">
      #{rank}
    </span>
  );
}

function DisplayName({ entry }: { entry: LeaderboardEntry }) {
  return (
    <span className="text-white">
      {entry.username ? `@${entry.username}` : (entry.name ?? "Anonymous")}
    </span>
  );
}

export default async function GameLeaderboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { slug } = await params;
  const { period: rawPeriod } = await searchParams;
  const period = ["today", "week", "all"].includes(rawPeriod ?? "") ? (rawPeriod ?? "all") : "all";

  const registryGame = gamesRegistry.find((g) => g.slug === slug);
  if (!registryGame) notFound();

  // Load game from DB for sortOrder; fall back gracefully if DB not set up
  let gameDb: { id: number; sortOrder: string | null } | null = null;
  try {
    const rows = await db
      .select({ id: games.id, sortOrder: games.sortOrder })
      .from(games)
      .where(eq(games.slug, slug))
      .limit(1);
    gameDb = rows[0] ?? null;
  } catch {
    // DB not configured yet
  }

  const isAsc = gameDb?.sortOrder === "asc";

  const session = await auth();
  const [leaderboard, userRank] = await Promise.all([
    gameDb ? getLeaderboard(gameDb.id, isAsc, period) : Promise.resolve([]),
    gameDb && session?.user?.id
      ? getUserRank(session.user.id, gameDb.id, isAsc, period)
      : Promise.resolve(null),
  ]);

  const periodLabels: Record<string, string> = {
    all: "All Time",
    week: "This Week",
    today: "Today",
  };

  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <Link href="/games">Games</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <Link href={`/games/${slug}`}>{registryGame.title}</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Leaderboard</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container max-w-[700px]">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-[64px] mb-3">{registryGame.icon}</div>
            <h1
              className="text-3xl sm:text-[40px] gradient-text-section mb-2"
              style={{ fontWeight: "var(--font-weight-bold)" }}
            >
              {registryGame.title}
            </h1>
            <p className="text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
              Leaderboard — {periodLabels[period]}
            </p>
          </div>

          {/* Your rank banner */}
          {userRank !== null && (
            <div className="card-glass p-4 mb-6 flex items-center justify-between">
              <span className="text-[var(--color-gray-300)]">Your rank this period</span>
              <span
                className="gradient-text text-[var(--font-size-2xl)]"
                style={{ fontWeight: "var(--font-weight-bold)" }}
              >
                #{userRank}
              </span>
            </div>
          )}

          {!session?.user && (
            <div className="card-glass p-4 mb-6 text-center text-[var(--color-gray-300)] text-sm">
              <Link href="/auth/login" className="text-[var(--color-cyan)]">
                Sign in
              </Link>{" "}
              to track your rank and save scores.
            </div>
          )}

          {/* Period tabs */}
          <Suspense>
            <LeaderboardTabs current={period} />
          </Suspense>

          {/* Table */}
          <div className="card-glass overflow-hidden">
            {leaderboard.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--color-gray-300)] text-[var(--font-size-xl)] mb-4">
                  No scores yet for this period.
                </p>
                <Link href={`/games/${slug}`} className="btn-gradient">
                  Be the first — Play now
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(125,211,252,0.1)]">
                    <th className="text-left px-6 py-3 text-[var(--color-gray-400)] text-xs font-medium uppercase tracking-wider w-[60px]">
                      Rank
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--color-gray-400)] text-xs font-medium uppercase tracking-wider">
                      Player
                    </th>
                    <th className="text-right px-6 py-3 text-[var(--color-gray-400)] text-xs font-medium uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-right px-6 py-3 text-[var(--color-gray-400)] text-xs font-medium uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr
                      key={i}
                      className="border-b border-[rgba(125,211,252,0.06)] last:border-0 hover:bg-[rgba(125,211,252,0.04)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <RankBadge rank={entry.rank} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {entry.image || entry.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={(entry.image ?? entry.avatarUrl)!}
                              alt=""
                              className="w-8 h-8 rounded-full border border-[rgba(125,211,252,0.2)]"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0"
                              style={{
                                background:
                                  "linear-gradient(135deg, var(--color-purple), var(--color-cyan))",
                              }}
                            >
                              {(entry.username ?? entry.name ?? "?")[0].toUpperCase()}
                            </div>
                          )}
                          <DisplayName entry={entry} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className="gradient-text text-[var(--font-size-xl)]"
                          style={{ fontWeight: "var(--font-weight-bold)" }}
                        >
                          {entry.score.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--color-gray-400)] text-sm hidden sm:table-cell">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Play + back links */}
          <div className="flex items-center justify-between mt-8">
            <Link
              href="/leaderboards"
              className="text-[var(--color-gray-400)] text-sm hover:text-white transition-colors"
            >
              &larr; All Leaderboards
            </Link>
            <Link href={`/games/${slug}`} className="btn-gradient">
              Play {registryGame.title}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
