"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Chess } from "chess.js";
import type { Square, Color, PieceSymbol } from "chess.js";
import { RotateCcw, BrainCircuit, User, Cpu, Zap } from "lucide-react";
import BoardSquare from "./BoardSquare";
import Piece from "./Piece";
import CapturedPieces from "./CapturedPieces";
import type { AiResponse, GameStatus } from "./types";

interface ChessGameProps {
  userId?: string;
}

export function ChessGame({ userId: _userId }: ChessGameProps) {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(() => new Chess().fen());
  const [orientation, setOrientation] = useState<Color>("w");
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [aiThinking, setAiThinking] = useState(false);
  const [commentary, setCommentary] = useState("Welcome to Gemini Chess. Make your move.");
  const [history, setHistory] = useState<string[]>([]);
  const [showStartup, setShowStartup] = useState(true);

  const board = useMemo(() => game.board(), [fen]); // eslint-disable-line react-hooks/exhaustive-deps
  const turn = game.turn();
  const inCheck = game.inCheck();
  const isGameOver = game.isGameOver();
  const lastMove = useMemo(() => {
    const h = game.history({ verbose: true });
    return h.length > 0 ? h[h.length - 1] : null;
  }, [fen]); // eslint-disable-line react-hooks/exhaustive-deps

  const safeGameMutate = (modify: (g: Chess) => void) => {
    setGame((g) => {
      const updated = new Chess(g.fen());
      modify(updated);
      return updated;
    });
  };

  const checkStatus = useCallback(() => {
    if (game.isCheckmate()) setStatus("checkmate");
    else if (game.isDraw()) setStatus("draw");
    else if (game.isStalemate()) setStatus("stalemate");
    else setStatus("playing");
  }, [game]);

  const makeMove = useCallback(
    (move: { from: Square; to: Square; promotion?: string }) => {
      try {
        const result = game.move(move);
        if (result) {
          setFen(game.fen());
          setHistory((prev) => [...prev, result.san]);
          checkStatus();
          return true;
        }
      } catch {
        return false;
      }
      return false;
    },
    [game, checkStatus]
  );

  // AI turn via server-side route
  useEffect(() => {
    const aiTurn = async () => {
      if (game.turn() !== orientation && !game.isGameOver() && status !== "idle") {
        setAiThinking(true);
        await new Promise((r) => setTimeout(r, 500));
        try {
          const res = await fetch("/api/chess/move", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fen: game.fen(), history }),
          });
          const aiData: AiResponse = await res.json();

          if (aiData.commentary) setCommentary(aiData.commentary);

          safeGameMutate((g) => {
            try {
              g.move(aiData.move);
            } catch {
              const validAiMoves = g.moves();
              if (validAiMoves.length > 0) {
                g.move(validAiMoves[Math.floor(Math.random() * validAiMoves.length)]);
                setCommentary("I reconsidered my strategy.");
              }
            }
          });
          setFen(game.fen());
          setHistory((prev) => [...prev, aiData.move]);
          checkStatus();
        } catch {
          setCommentary("I'm having trouble concentrating on the board right now.");
        } finally {
          setAiThinking(false);
        }
      }
    };
    aiTurn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]);

  const onSquareClick = (square: Square) => {
    if (game.turn() !== orientation || isGameOver || aiThinking) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    const piece = game.get(square);
    if (piece && piece.color === orientation) {
      setSelectedSquare(square);
      setValidMoves(game.moves({ square, verbose: true }).map((m) => m.to as Square));
      return;
    }

    if (selectedSquare) {
      const moved = makeMove({ from: selectedSquare, to: square, promotion: "q" });
      setSelectedSquare(null);
      setValidMoves([]);
      if (!moved) {
        // Try selecting new piece
        if (piece && piece.color === orientation) {
          setSelectedSquare(square);
          setValidMoves(game.moves({ square, verbose: true }).map((m) => m.to as Square));
        }
      }
    }
  };

  const getCapturedPieces = (color: Color) =>
    game
      .history({ verbose: true })
      .filter((m) => m.color === color && m.captured)
      .map((m) => ({ type: m.captured as PieceSymbol, color: color === "w" ? ("b" as Color) : ("w" as Color) }));

  const restartGame = () => {
    const fresh = new Chess();
    setGame(fresh);
    setFen(fresh.fen());
    setHistory([]);
    setStatus("playing");
    setCommentary("New game started. Good luck.");
    setAiThinking(false);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const boardFiles = orientation === "w" ? files : [...files].reverse();
  const boardRanks = orientation === "w" ? ranks : [...ranks].reverse();

  if (showStartup) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BrainCircuit className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Gemini Chess</h2>
          <p className="text-slate-400 mb-8">
            Challenge the Google Gemini AI in a battle of wits. Experience real-time commentary on your gameplay.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => { setOrientation("w"); setStatus("playing"); setShowStartup(false); }}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" /> Play as White
            </button>
            <button
              onClick={() => { setOrientation("b"); setStatus("playing"); setShowStartup(false); }}
              className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Cpu className="w-5 h-5" /> Play as Black
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-4 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-slate-900 p-5 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Gemini Chess</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${status === "playing" ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
              <span className="text-xs text-slate-400 uppercase tracking-wider">{status}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex-1 relative overflow-auto max-h-48 lg:max-h-none">
          <div className="absolute top-3 right-3 text-slate-600"><Zap className="w-4 h-4" /></div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AI Commentary</h3>
          <p className="text-sm text-slate-300 leading-relaxed italic">"{commentary}"</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Opponent (AI)</span>
            <CapturedPieces pieces={getCapturedPieces(orientation)} />
          </div>
          <div className="h-px bg-slate-800" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">You</span>
            <CapturedPieces pieces={getCapturedPieces(orientation === "w" ? "b" : "w")} />
          </div>
        </div>

        <button
          onClick={restartGame}
          className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all text-sm font-semibold mt-auto"
        >
          <RotateCcw className="w-4 h-4" /> Reset Board
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-4 lg:p-8 relative">
        <div className="relative">
          {isGameOver && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg">
              <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {status === "checkmate" ? (game.turn() === orientation ? "Defeat" : "Victory") : "Draw"}
                </h2>
                <p className="text-slate-400 mb-6">
                  {status === "checkmate" ? "Checkmate." : "The game ended in a draw."}
                </p>
                <button
                  onClick={restartGame}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-medium transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}

          <div className="relative shadow-2xl shadow-black/50 rounded-lg overflow-hidden border-4 border-slate-800 select-none">
            <div className="grid grid-cols-8 grid-rows-8 w-[288px] h-[288px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] lg:w-[540px] lg:h-[540px]">
              {boardRanks.map((rank, rIdx) =>
                boardFiles.map((file, fIdx) => {
                  const square = `${file}${rank}` as Square;
                  const isBlack = (rIdx + fIdx) % 2 === 1;
                  const piece = game.get(square);
                  return (
                    <BoardSquare
                      key={square}
                      square={square}
                      isBlack={isBlack}
                      isSelected={selectedSquare === square}
                      isLastMove={lastMove ? lastMove.from === square || lastMove.to === square : false}
                      isValidMove={validMoves.includes(square)}
                      isCheck={inCheck && piece?.type === "k" && piece?.color === turn}
                      onClick={() => onSquareClick(square)}
                    >
                      {piece && <Piece type={piece.type} color={piece.color} />}
                    </BoardSquare>
                  );
                })
              )}
            </div>
            {aiThinking && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-slate-900/90 backdrop-blur rounded-full border border-emerald-500/30 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-xs text-emerald-100">Gemini is thinking…</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-200 rounded-sm" /> White
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-800 border border-slate-600 rounded-sm" /> Black
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
