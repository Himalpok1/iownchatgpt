import type { PieceSymbol, Color } from "chess.js";

interface PieceProps {
  type: PieceSymbol;
  color: Color;
}

export default function Piece({ type, color }: PieceProps) {
  const isWhite = color === "w";
  const fill = isWhite ? "#f8fafc" : "#1e293b";
  const stroke = isWhite ? "#1e293b" : "#f8fafc";

  const paths: Record<PieceSymbol, React.ReactNode> = {
    p: (
      <g transform="translate(10, 10) scale(0.8)">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" stroke={stroke} fill={fill} strokeWidth="1.5" />
      </g>
    ),
    r: (
      <g transform="translate(10, 10) scale(0.8)">
        <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke={stroke} fill={fill} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 14V29C11 29 12.79 29 13 29H32C32.21 29 34 29 34 29V14" stroke={stroke} fill={fill} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 31v-2h21v2H12z" stroke={stroke} fill={fill} strokeWidth="1.5" />
      </g>
    ),
    n: (
      <g transform="translate(10, 10) scale(0.8)">
        <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" stroke={stroke} fill={fill} strokeWidth="1.5" />
        <path d="M24 18c.38 2.32-4.68 3.23-5 6 0 0-4.41.5-10-8.5 0 0 1.49-6.08 4-6.5 0 0 .9-3.59 4-4 0 0 5.41-.5 7.5 5" stroke={stroke} fill={fill} strokeWidth="1.5" />
      </g>
    ),
    b: (
      <g transform="translate(10, 10) scale(0.8)">
        <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45V32H9v4z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
        </g>
        <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </g>
    ),
    q: (
      <g transform="translate(10, 10) scale(0.8)">
        <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" />
          <path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 3 1 5.5 1.5 5 1 13 1 18-1.5 2.5-.5 4.5 1 5.5-1.5 1-2 2.5-2 2.5-4H9z" />
          <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" />
        </g>
      </g>
    ),
    k: (
      <g transform="translate(10, 10) scale(0.8)">
        <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" />
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 5.5-8 12h-11c-3-6.5-4-13-8-12-3 6 6 10.5 6 10.5v7z" />
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
        </g>
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 65 65" className="w-full h-full filter drop-shadow-md transition-transform duration-200 hover:scale-105">
      {paths[type]}
    </svg>
  );
}
