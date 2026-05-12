/**
 * Copies legacy game directories into public/legacy/ so Next.js can serve
 * them as static files (used by GameWrapper iframes).
 *
 * Run: npx tsx scripts/sync-legacy.ts
 */

import { cpSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LEGACY = join(ROOT, "legacy");
const PUBLIC_LEGACY = join(ROOT, "public", "legacy");

const GAME_DIRS = [
  "snake",
  "pong",
  "breakout",
  "tetris",
  "flappybird",
  "tictactoe",
  "memory-match",
  "rock-paper-scissors",
  "whack-a-mole",
  "2048",
  "simon-memory",
  "minesweeper",
  "sudoku",
  "space-shooter",
  "connect-four",
  "word-guess",
  "viralimpostertiktokgame",
];

mkdirSync(PUBLIC_LEGACY, { recursive: true });

for (const dir of GAME_DIRS) {
  const src = join(LEGACY, dir);
  const dest = join(PUBLIC_LEGACY, dir);

  if (!existsSync(src)) {
    console.warn(`  ⚠  Missing: legacy/${dir}`);
    continue;
  }

  cpSync(src, dest, { recursive: true, force: true });
  console.log(`  ✓  Synced: public/legacy/${dir}`);
}

console.log(`\n✅ Done — ${GAME_DIRS.length} game directories synced to public/legacy/`);
