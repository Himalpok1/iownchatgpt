export interface Game {
  slug: string;
  title: string;
  description: string;
  icon: string;
  legacyPath: string;
  /** 'react' games render a dedicated React component instead of an iframe */
  type?: "iframe" | "react";
}

export const games: Game[] = [
  {
    slug: "viralimpostertiktokgame",
    title: "Imposter Viral TikTok Game",
    description:
      "Based on the viral TikTok trend. Find the impostor among the players!",
    icon: "\uD83C\uDFAD",
    legacyPath: "viralimpostertiktokgame/index.html",
  },
  {
    slug: "tictactoe",
    title: "Tic Tac Toe",
    description:
      "Classic strategy game. Challenge yourself or play against a friend.",
    icon: "\u2B55",
    legacyPath: "tictactoe/index.html",
  },
  {
    slug: "flappybird",
    title: "Flappy Bird",
    description: "The beloved classic. Tap to fly and avoid the pipes!",
    icon: "\uD83D\uDC26",
    legacyPath: "flappybird/index.html",
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    description:
      "Flip cards, find matching pairs, and beat your best time.",
    icon: "\uD83E\uDDE0",
    legacyPath: "memory-match/index.html",
  },
  {
    slug: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description:
      "Quick head to head rounds against the computer. First to five wins.",
    icon: "\u270A",
    legacyPath: "rock-paper-scissors/index.html",
  },
  {
    slug: "whack-a-mole",
    title: "Whack-a-Mole",
    description:
      "Test your reflexes in a 30 second speed round and chase a high score.",
    icon: "\uD83D\uDC39",
    legacyPath: "whack-a-mole/index.html",
  },
  {
    slug: "2048",
    title: "2048",
    description:
      "Merge matching tiles, plan each move, and reach the 2048 tile.",
    icon: "\uD83D\uDD22",
    legacyPath: "2048/index.html",
  },
  {
    slug: "snake",
    title: "Snake",
    description:
      "Eat food, grow longer, and survive faster movement as your score climbs.",
    icon: "\uD83D\uDC0D",
    legacyPath: "snake/index.html",
  },
  {
    slug: "pong",
    title: "Pong",
    description:
      "Face the computer in a classic paddle match and race to seven points.",
    icon: "\uD83C\uDFD3",
    legacyPath: "pong/index.html",
  },
  {
    slug: "breakout",
    title: "Breakout",
    description:
      "Break every brick while keeping the ball alive through tighter angles.",
    icon: "\uD83E\uDDF1",
    legacyPath: "breakout/index.html",
  },
  {
    slug: "tetris",
    title: "Block Stacker",
    description:
      "Stack falling blocks, clear lines, and handle increasing speed each level.",
    icon: "\uD83D\uDFE6",
    legacyPath: "tetris/index.html",
  },
  {
    slug: "space-shooter",
    title: "Space Shooter",
    description:
      "Dodge enemy fire, clear invasion waves, and protect your base.",
    icon: "\uD83D\uDE80",
    legacyPath: "space-shooter/index.html",
  },
  {
    slug: "connect-four",
    title: "Connect Four",
    description:
      "Drop discs in local two-player mode and connect four before your opponent.",
    icon: "\uD83D\uDD34",
    legacyPath: "connect-four/index.html",
  },
  {
    slug: "minesweeper",
    title: "Minesweeper",
    description:
      "Reveal safe cells, flag mines, and clear the board against the clock.",
    icon: "\uD83D\uDCA3",
    legacyPath: "minesweeper/index.html",
  },
  {
    slug: "sudoku",
    title: "Sudoku",
    description:
      "Fill each row, column, and subgrid with numbers 1 to 9.",
    icon: "\uD83E\uDDE9",
    legacyPath: "sudoku/index.html",
  },
  {
    slug: "simon-memory",
    title: "Simon Memory",
    description:
      "Watch color patterns, repeat them, and push your best memory level.",
    icon: "\uD83D\uDFE2",
    legacyPath: "simon-memory/index.html",
  },
  {
    slug: "word-guess",
    title: "Word Guess",
    description:
      "Use letter clues and hints to solve hidden words before attempts run out.",
    icon: "\uD83D\uDD24",
    legacyPath: "word-guess/index.html",
  },
  {
    slug: "chess",
    title: "Chess vs Gemini AI",
    description:
      "Challenge the Google Gemini AI in a full chess match. Real-time AI commentary on every move.",
    icon: "♟️",
    legacyPath: "chess/index.html",
    type: "react" as const,
  },
];

export const comingSoonGames = [
  { title: "Speed Racer", icon: "\uD83C\uDFCE\uFE0F" },
  { title: "Checkers", icon: "\u265F\uFE0F" },
  { title: "Maze Runner", icon: "\uD83D\uDC7E" },
];
