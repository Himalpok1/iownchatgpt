import { NextResponse } from "next/server";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db, scores, games, users, isDatabaseConfigured } from "@/lib/db";

const submitScoreSchema = z.object({
  gameSlug: z.string().min(1),
  score: z.number().int().min(0),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// POST /api/scores — submit a score
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = submitScoreSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { gameSlug, score: scoreValue, metadata } = parsed.data;

    const game = await db
      .select({ id: games.id })
      .from(games)
      .where(eq(games.slug, gameSlug))
      .limit(1);

    if (!game[0]) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const [inserted] = await db
      .insert(scores)
      .values({
        userId: session.user.id,
        gameId: game[0].id,
        score: scoreValue,
        metadata: metadata ?? null,
      })
      .returning();

    // Rank = number of scores strictly better than this one + 1
    const rankResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(scores)
      .where(sql`game_id = ${game[0].id} AND score > ${scoreValue}`);

    const rank = Number(rankResult[0]?.count ?? 0) + 1;

    return NextResponse.json({ score: inserted, rank }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/scores?game=snake&limit=50&period=all|week|today
export async function GET(request: Request) {
  try {
    if (!isDatabaseConfigured) {
      return NextResponse.json({ leaderboard: [] });
    }

    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("game");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    const period = searchParams.get("period") ?? "all"; // 'all' | 'week' | 'today'

    if (!gameSlug) {
      return NextResponse.json({ error: "game param required" }, { status: 400 });
    }

    const game = await db
      .select({ id: games.id, sortOrder: games.sortOrder })
      .from(games)
      .where(eq(games.slug, gameSlug))
      .limit(1);

    if (!game[0]) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Period filter
    const now = new Date();
    const periodFilter =
      period === "today"
        ? gte(scores.createdAt, new Date(now.getFullYear(), now.getMonth(), now.getDate()))
        : period === "week"
        ? gte(scores.createdAt, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
        : null;

    const whereClause = periodFilter
      ? and(eq(scores.gameId, game[0].id), periodFilter)
      : eq(scores.gameId, game[0].id);

    const isAsc = game[0].sortOrder === "asc";

    const leaderboard = await db
      .select({
        rank: sql<number>`rank() over (order by ${scores.score} ${isAsc ? sql`asc` : sql`desc`})`,
        score: scores.score,
        createdAt: scores.createdAt,
        metadata: scores.metadata,
        username: users.username,
        name: users.name,
        avatarUrl: users.avatarUrl,
        image: users.image,
      })
      .from(scores)
      .innerJoin(users, eq(scores.userId, users.id))
      .where(whereClause)
      .orderBy(isAsc ? scores.score : desc(scores.score))
      .limit(limit);

    return NextResponse.json({ leaderboard });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
