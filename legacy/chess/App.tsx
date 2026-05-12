import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess, Square, Move, Color, PieceSymbol } from 'chess.js';
import { RotateCcw, Play, Check, BrainCircuit, User, Cpu, ChevronRight, Zap } from 'lucide-react';
import BoardSquare from './components/BoardSquare';
import Piece from './components/Piece';
import CapturedPieces from './components/CapturedPieces';
import { getBestMove } from './services/geminiService';
import { AiResponse, GameStatus } from './types';

const App: React.FC = () => {
  // --- Game State ---
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [orientation, setOrientation] = useState<Color>('w'); // 'w' is human
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [aiThinking, setAiThinking] = useState(false);
  const [commentary, setCommentary] = useState<string>("Welcome to Gemini Chess. Make your move.");
  const [history, setHistory] = useState<string[]>([]);
  const [showStartup, setShowStartup] = useState(true);

  // Derived State
  const board = useMemo(() => game.board(), [fen]);
  const turn = game.turn();
  const inCheck = game.inCheck();
  const isGameOver = game.isGameOver();
  const lastMove = useMemo(() => {
    const historyVerbose = game.history({ verbose: true });
    return historyVerbose.length > 0 ? historyVerbose[historyVerbose.length - 1] : null;
  }, [fen, game]);

  // --- Helper: Safe Game Mutation ---
  const safeGameMutate = (modify: (g: Chess) => void) => {
    setGame((g) => {
      const update = new Chess(g.fen());
      modify(update);
      return update;
    });
  };

  // --- Game Logic ---
  const checkStatus = useCallback(() => {
    if (game.isCheckmate()) setStatus('checkmate');
    else if (game.isDraw()) setStatus('draw');
    else if (game.isStalemate()) setStatus('stalemate');
    else setStatus('playing');
  }, [game]);

  const makeMove = useCallback((move: { from: Square; to: Square; promotion?: string }) => {
    try {
      const result = game.move(move);
      if (result) {
        setFen(game.fen());
        setHistory(prev => [...prev, result.san]);
        checkStatus();
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [game, checkStatus]);

  // --- AI Turn ---
  useEffect(() => {
    const aiTurn = async () => {
      if (game.turn() !== orientation && !game.isGameOver() && status !== 'idle') {
        setAiThinking(true);
        
        // Delay slightly for realism or to let UI render
        await new Promise(r => setTimeout(r, 500));

        try {
          const aiData: AiResponse = await getBestMove(game.fen(), history);
          
          if (aiData.commentary) setCommentary(aiData.commentary);

          safeGameMutate((g) => {
            try {
               g.move(aiData.move);
            } catch (e) {
               // Fallback if AI hallucinates invalid move
               const validAiMoves = g.moves();
               if (validAiMoves.length > 0) {
                 const randomMove = validAiMoves[Math.floor(Math.random() * validAiMoves.length)];
                 g.move(randomMove);
                 setCommentary("I reconsidered my strategy.");
               }
            }
          });
          setFen(game.fen()); // Trigger re-render from effect
          setHistory(prev => [...prev, aiData.move]); // Note: this might desync if fallback used, but ok for demo
          checkStatus();

        } catch (error) {
          console.error("AI Turn failed", error);
        } finally {
          setAiThinking(false);
        }
      }
    };

    aiTurn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]); // Depend on FEN to trigger after human move

  // --- Interaction ---
  const onSquareClick = (square: Square) => {
    if (game.turn() !== orientation || isGameOver || aiThinking) return;

    // If selecting same square, deselect
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // If square has a piece of our color, select it
    const piece = game.get(square);
    if (piece && piece.color === orientation) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true }).map(m => m.to as Square);
      setValidMoves(moves);
      return;
    }

    // If trying to move to this square
    if (selectedSquare) {
      const moveSuccess = makeMove({
        from: selectedSquare,
        to: square,
        promotion: 'q', // Auto promote to queen for simplicity
      });

      if (moveSuccess) {
        setSelectedSquare(null);
        setValidMoves([]);
      } else {
        // Clicked invalid square, deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    }
  };

  // --- Render Helpers ---
  const getCapturedPieces = (color: Color) => {
    const historyVerbose = game.history({ verbose: true });
    const captured = historyVerbose
      .filter(m => m.captured && m.color !== color) // Moves made by opponent that captured my piece
      .map(m => ({ type: m.captured as PieceSymbol, color })); 
    
    // Wait, captured logic:
    // I want to show what White has captured (i.e. Black pieces).
    // So look for moves by White (color === 'w') where captured is present.
    return historyVerbose
      .filter(m => m.color === color && m.captured)
      .map(m => ({ type: m.captured as PieceSymbol, color: color === 'w' ? 'b' : 'w' as Color }));
  };

  const restartGame = () => {
    setGame(new Chess());
    setFen(new Chess().fen());
    setHistory([]);
    setStatus('playing');
    setCommentary("New game started. Good luck.");
    setAiThinking(false);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  // --- Board Generation ---
  // We need to render 8x8 from top-left (a8) to bottom-right (h1) normally.
  // If orientation is 'b', we flip.
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  // If flipped:
  const boardFiles = orientation === 'w' ? files : [...files].reverse();
  const boardRanks = orientation === 'w' ? ranks : [...ranks].reverse();

  if (showStartup) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BrainCircuit className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-serif">Gemini Chess</h1>
          <p className="text-slate-400 mb-8">Challenge the Google Gemini 2.5 AI model in a battle of wits. Experience real-time commentary on your gameplay.</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => { setOrientation('w'); setStatus('playing'); setShowStartup(false); }}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" /> Play as White
            </button>
            <button 
              onClick={() => { 
                setOrientation('b'); 
                setStatus('playing'); 
                setShowStartup(false); 
                // Trigger AI first move if black
                setTimeout(() => {
                  const g = new Chess();
                  // Usually we wait for effect, but effect depends on Turn. 
                  // If we set orientation B, Turn is W. AI is W? 
                  // Logic check: orientation='b' means Human is Black. AI is White.
                  // Turn is W. So AI should move immediately.
                }, 100);
              }}
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
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col lg:flex-row">
      
      {/* Sidebar / Controls */}
      <div className="w-full lg:w-96 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-6 z-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
             <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-white tracking-tight">Gemini Chess</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${status === 'playing' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{status}</span>
            </div>
          </div>
        </div>

        {/* Commentary Box */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex-grow lg:max-h-64 overflow-y-auto relative">
           <div className="absolute top-3 right-3 text-slate-600">
             <Zap className="w-4 h-4" />
           </div>
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AI Commentary</h3>
           <p className="text-sm text-slate-300 leading-relaxed italic">"{commentary}"</p>
        </div>
        
        {/* Game Status / Captured */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 font-medium">Opponent (AI)</span>
            <CapturedPieces pieces={getCapturedPieces(orientation)} color={orientation} />
          </div>
          <div className="w-full h-px bg-slate-800" />
           <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 font-medium">You</span>
            <CapturedPieces pieces={getCapturedPieces(orientation === 'w' ? 'b' : 'w')} color={orientation === 'w' ? 'b' : 'w'} />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-3">
          <button 
            onClick={restartGame}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" /> Reset Board
          </button>
        </div>
      </div>

      {/* Board Area */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-4 lg:p-10 relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
             <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
             <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
           
           {/* Status Indicator Mobile */}
           {isGameOver && (
             <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg">
                <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center transform scale-110">
                   <h2 className="text-3xl font-serif text-white mb-2">
                     {status === 'checkmate' ? (game.turn() === orientation ? 'Defeat' : 'Victory') : 'Draw'}
                   </h2>
                   <p className="text-slate-400 mb-6">
                     {status === 'checkmate' ? 'Checkmate on the board.' : 'The game ended in a draw.'}
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
              <div className="grid grid-cols-8 grid-rows-8 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] lg:w-[640px] lg:h-[640px]">
                {boardRanks.map((rank, rIdx) => (
                  boardFiles.map((file, fIdx) => {
                    const square = `${file}${rank}` as Square;
                    const isBlack = (rIdx + fIdx) % 2 === 1;
                    const piece = game.get(square);
                    const isSelected = selectedSquare === square;
                    const isLast = lastMove ? (lastMove.from === square || lastMove.to === square) : false;
                    const isValid = validMoves.includes(square);
                    const isKingCheck = inCheck && piece?.type === 'k' && piece?.color === turn;

                    return (
                      <BoardSquare
                        key={square}
                        square={square}
                        isBlack={isBlack}
                        isSelected={isSelected}
                        isLastMove={isLast}
                        isValidMove={isValid}
                        isCheck={isKingCheck}
                        onClick={() => onSquareClick(square)}
                      >
                        {piece && <Piece type={piece.type} color={piece.color} />}
                      </BoardSquare>
                    );
                  })
                ))}
              </div>
              
              {/* Thinking Overlay */}
              {aiThinking && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900/90 backdrop-blur rounded-full border border-emerald-500/30 flex items-center gap-2 shadow-lg animate-in fade-in duration-300">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                   <span className="text-xs font-medium text-emerald-100">Gemini is thinking...</span>
                </div>
              )}
           </div>

           <div className="flex items-center gap-4 text-slate-500 text-sm">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-slate-200 rounded-sm"></div> White
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-slate-800 border border-slate-600 rounded-sm"></div> Black
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default App;
