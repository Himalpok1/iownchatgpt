import React from 'react';
import { PieceSymbol, Color } from 'chess.js';
import Piece from './Piece';

interface CapturedPiecesProps {
  pieces: { type: PieceSymbol; color: Color }[];
  color: Color;
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color }) => {
  const captured = pieces.filter((p) => p.color !== color); // Pieces of 'color' that have been captured? No, usually we show what WE captured. 
  // If I am White, I want to see the Black pieces I captured.
  // So if this component is "White's Captures", it displays Black pieces.
  
  // Let's simpler logic: The prop 'pieces' is simply the list of pieces to display.
  // We will compute the list in the parent.

  return (
    <div className="flex flex-wrap gap-1 h-8 items-center">
      {pieces.map((p, idx) => (
        <div key={idx} className="w-6 h-6 opacity-80">
           <Piece type={p.type} color={p.color} />
        </div>
      ))}
    </div>
  );
};

export default CapturedPieces;