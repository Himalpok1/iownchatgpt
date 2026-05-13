import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db, scores, games } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Get user info + recent scores
  let recentScores: Array<{ score: number; createdAt: Date; gameName: string; gameSlug: string }> = [];
  try {
    recentScores = await db
      .select({
        score: scores.score,
        createdAt: scores.createdAt,
        gameName: games.name,
        gameSlug: games.slug,
      })
      .from(scores)
      .innerJoin(games, eq(scores.gameId, games.id))
      .where(eq(scores.userId, session.user.id))
      .orderBy(desc(scores.createdAt))
      .limit(20);
  } catch {
    // DB not configured yet — show empty state
  }

  const initials =
    session.user.name?.[0]?.toUpperCase() ??
    session.user.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">My Profile</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container max-w-[800px]">
          {/* Profile header */}
          <div className="card-glass p-8 text-center mb-8">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt="avatar"
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[rgba(125,211,252,0.4)]"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-purple), var(--color-cyan))",
                }}
              >
                {initials}
              </div>
            )}
            <h1
              className="text-[var(--font-size-3xl)] text-white mb-1"
              style={{ fontWeight: "var(--font-weight-bold)" }}
            >
              {session.user.name ?? session.user.email?.split("@")[0]}
            </h1>
            <p className="text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
              {session.user.email}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Games Played", value: recentScores.length },
              { label: "Unique Games", value: new Set(recentScores.map((s) => s.gameSlug)).size },
              { label: "Best Score", value: recentScores.length > 0 ? Math.max(...recentScores.map((s) => s.score)).toLocaleString() : "-" },
            ].map((stat) => (
              <div key={stat.label} className="card-glass p-6 text-center">
                <div
                  className="text-[var(--font-size-4xl)] mb-1 gradient-text"
                  style={{ fontWeight: "var(--font-weight-bold)" }}
                >
                  {stat.value}
                </div>
                <div className="text-[var(--color-gray-300)] text-[var(--font-size-lg)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent scores */}
          <div className="card-glass p-6">
            <h2
              className="text-[var(--font-size-2xl)] text-white mb-6"
              style={{ fontWeight: "var(--font-weight-semibold)" }}
            >
              Recent Scores
            </h2>

            {recentScores.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--color-gray-300)] text-[var(--font-size-xl)] mb-6">
                  No scores yet. Go play some games!
                </p>
                <Link href="/games" className="btn-gradient">
                  Browse Games
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentScores.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-[rgba(125,211,252,0.08)] last:border-0"
                  >
                    <Link
                      href={`/games/${s.gameSlug}`}
                      className="text-[var(--color-cyan)] text-[var(--font-size-lg)] no-underline hover:opacity-80"
                    >
                      {s.gameName}
                    </Link>
                    <div className="flex items-center gap-6">
                      <span
                        className="gradient-text text-[var(--font-size-xl)]"
                        style={{ fontWeight: "var(--font-weight-bold)" }}
                      >
                        {s.score.toLocaleString()}
                      </span>
                      <span className="text-[var(--color-gray-400)] text-sm">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
