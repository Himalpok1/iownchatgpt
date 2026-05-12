import type { PieceSymbol, Color } from "chess.js";
import Piece from "./Piece";

interface CapturedPiecesProps {
  pieces: { type: PieceSymbol; color: Color }[];
}

export default function CapturedPieces({ pieces }: CapturedPiecesProps) {
  return (
    <div className="flex flex-wrap gap-1 h-8 items-center">
      {pieces.map((p, idx) => (
        <div key={idx} className="w-6 h-6 opacity-80">
          <Piece type={p.type} color={p.color} />
        </div>
      ))}
    </div>
  );
}
