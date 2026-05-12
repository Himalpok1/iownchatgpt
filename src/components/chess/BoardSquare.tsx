import type { Square } from "chess.js";

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

export default function BoardSquare({
  square,
  isBlack,
  children,
  isSelected,
  isLastMove,
  isValidMove,
  isCheck,
  onClick,
}: BoardSquareProps) {
  const baseColor = isBlack ? "bg-slate-600" : "bg-slate-300";

  let overlay = "";
  if (isSelected) overlay = "bg-emerald-500/60";
  else if (isLastMove) overlay = "bg-emerald-500/40";
  else if (isCheck) overlay = "bg-red-500/50";

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full flex justify-center items-center cursor-pointer ${baseColor} transition-colors duration-150`}
      data-square={square}
    >
      {(square.includes("1") || square.includes("8")) && !isBlack && (
        <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${isBlack ? "text-slate-300" : "text-slate-600"}`}>
          {square.charAt(0)}
        </span>
      )}
      {(square.includes("a") || square.includes("h")) && isBlack && (
        <span className={`absolute top-0.5 left-1 text-[10px] font-bold ${isBlack ? "text-slate-300" : "text-slate-600"}`}>
          {square.charAt(1)}
        </span>
      )}
      <div className={`absolute inset-0 ${overlay}`} />
      {isValidMove && (
        <div className={`absolute w-3 h-3 rounded-full ${children ? "border-4 border-slate-800/50 w-full h-full rounded-none border-dashed" : "bg-black/20"}`} />
      )}
      <div className="relative z-10 w-4/5 h-4/5 pointer-events-none">{children}</div>
    </div>
  );
}
