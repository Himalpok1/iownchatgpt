import React from 'react';
import { Square } from 'chess.js';

interface BoardSquareProps {
  square: Square;
  isBlack: boolean;
  children: React.ReactNode;
  isSelected: boolean;
  isLastMove: boolean;
  isValidMove: boolean;
  isCheck: boolean;
  onClick: () => void;
}

const BoardSquare: React.FC<BoardSquareProps> = ({
  square,
  isBlack,
  children,
  isSelected,
  isLastMove,
  isValidMove,
  isCheck,
  onClick,
}) => {
  // Base Colors - Slate theme
  const baseColor = isBlack ? 'bg-slate-600' : 'bg-slate-300';
  
  // Overlays
  let overlay = '';
  if (isSelected) overlay = 'bg-emerald-500/60';
  else if (isLastMove) overlay = 'bg-emerald-500/40';
  else if (isCheck) overlay = 'bg-red-500/50 radial-gradient';
  
  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full flex justify-center items-center cursor-pointer ${baseColor} transition-colors duration-150`}
      data-square={square}
    >
      {/* Notation Labels */}
      {(square.includes('1') || square.includes('8')) && !isBlack && (
        <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${isBlack ? 'text-slate-300' : 'text-slate-600'}`}>
          {square.charAt(0)}
        </span>
      )}
       {(square.includes('a') || square.includes('h')) && isBlack && (
        <span className={`absolute top-0.5 left-1 text-[10px] font-bold ${isBlack ? 'text-slate-300' : 'text-slate-600'}`}>
          {square.charAt(1)}
        </span>
      )}

      {/* Move Check Overlay */}
      <div className={`absolute inset-0 ${overlay}`} />
      
      {/* Valid Move Indicator */}
      {isValidMove && (
        <div className={`absolute w-3 h-3 rounded-full ${children ? 'border-4 border-slate-800/50 w-full h-full rounded-none border-dashed' : 'bg-black/20'}`} />
      )}
       {/* For capture moves, we often do a corner ring or similar, but the dashed border above handles 'capture' valid moves visually well */}

      {/* Piece */}
      <div className="relative z-10 w-4/5 h-4/5 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default BoardSquare;
