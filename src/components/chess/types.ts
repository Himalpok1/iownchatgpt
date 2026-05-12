import type { Square, PieceSymbol, Color, Move } from "chess.js";

export type { Square, PieceSymbol, Color, Move };

export type GameStatus = "idle" | "playing" | "checkmate" | "draw" | "stalemate";

export interface AiResponse {
  move: string;
  commentary: string;
}
