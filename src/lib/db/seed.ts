/**
 * Run with: npx tsx src/lib/db/seed.ts
 * Seeds the games table from the games registry.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { games as gamesTable } from "./schema";
import { games as gamesRegistry } from "@/lib/games";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const gameCategories: Record<string, { category: string; scoreType: string; sortOrder: string }> = {
  "2048": { category: "puzzle", scoreType: "points", sortOrder: "desc" },
  snake: { category: "arcade", scoreType: "points", sortOrder: "desc" },
  pong: { category: "arcade", scoreType: "points", sortOrder: "desc" },
  breakout: { category: "arcade", scoreType: "points", sortOrder: "desc" },
  tetris: { category: "arcade", scoreType: "points", sortOrder: "desc" },
  flappybird: { category: "arcade", scoreType: "points", sortOrder: "desc" },
  tictactoe: { category: "strategy", scoreType: "points", sortOrder: "desc" },
  "memory-match": { category: "puzzle", scoreType: "time", sortOrder: "asc" },
  "rock-paper-scissors": { category: "arcade", scoreType: "points", sortOrder: "desc" },
  "whack-a-mole": { category: "arcade", scoreType: "points", sortOrder: "desc" },
  "simon-memory": { category: "puzzle", scoreType: "level", sortOrder: "desc" },
  minesweeper: { category: "puzzle", scoreType: "time", sortOrder: "asc" },
  sudoku: { category: "puzzle", scoreType: "time", sortOrder: "asc" },
  "space-shooter": { category: "arcade", scoreType: "points", sortOrder: "desc" },
  "connect-four": { category: "strategy", scoreType: "points", sortOrder: "desc" },
  "word-guess": { category: "puzzle", scoreType: "points", sortOrder: "desc" },
  viralimpostertiktokgame: { category: "multiplayer", scoreType: "points", sortOrder: "desc" },
  impostergamenepali: { category: "multiplayer", scoreType: "points", sortOrder: "desc" },
};

async function seed() {
  console.log("Seeding games...");

  for (const game of gamesRegistry) {
    const meta = gameCategories[game.slug] ?? {
      category: "arcade",
      scoreType: "points",
      sortOrder: "desc",
    };

    await db
      .insert(gamesTable)
      .values({
        slug: game.slug,
        name: game.title,
        description: game.description,
        category: meta.category,
        scoreType: meta.scoreType,
        sortOrder: meta.sortOrder,
        multiplayerEnabled: meta.category === "multiplayer",
      })
      .onConflictDoUpdate({
        target: gamesTable.slug,
        set: {
          name: game.title,
          description: game.description,
          category: meta.category,
        },
      });

    console.log(`  ✓ ${game.slug}`);
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
