import { Square, PieceSymbol, Color, Move } from 'chess.js';

export type GameStatus = 'idle' | 'playing' | 'checkmate' | 'draw' | 'stalemate';

export interface GameState {
  fen: string;
  turn: Color;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  history: string[];
  lastMove: Move | null;
}

export interface AiResponse {
  move: string;
  commentary: string;
}

export interface Theme {
  light: string;
  dark: string;
  highlight: string;
  validMove: string;
}

export type PlayerType = 'human' | 'ai';
