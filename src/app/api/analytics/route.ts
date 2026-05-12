import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db, gameSessions, games } from "@/lib/db";

const sessionSchema = z.object({
  gameSlug: z.string().min(1),
  sessionId: z.string().uuid().optional(),
  action: z.enum(["start", "end"]),
  finalScore: z.number().int().min(0).optional(),
  durationMs: z.number().int().min(0).optional(),
  completed: z.boolean().optional(),
  deviceType: z.enum(["desktop", "mobile", "tablet"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const parsed = sessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { gameSlug, sessionId, action, finalScore, durationMs, completed, deviceType, metadata } = parsed.data;

    const game = await db
      .select({ id: games.id })
      .from(games)
      .where(eq(games.slug, gameSlug))
      .limit(1);

    if (!game[0]) {
      // Don't error — analytics are best-effort
      return NextResponse.json({ ok: true });
    }

    if (action === "start") {
      const [inserted] = await db
        .insert(gameSessions)
        .values({
          userId: session?.user?.id ?? null,
          gameId: game[0].id,
          sessionId: sessionId ?? null,
          deviceType: deviceType ?? null,
          metadata: metadata ?? null,
        })
        .returning({ id: gameSessions.id });

      return NextResponse.json({ sessionDbId: inserted.id });
    } else {
      // action === "end" — update the session by sessionId
      if (sessionId) {
        await db
          .update(gameSessions)
          .set({
            endedAt: new Date(),
            durationMs: durationMs ?? null,
            finalScore: finalScore ?? null,
            completed: completed ?? false,
          })
          .where(eq(gameSessions.sessionId, sessionId));
      }
      return NextResponse.json({ ok: true });
    }
  } catch {
    // Analytics are always best-effort — never break the game
    return NextResponse.json({ ok: true });
  }
}
