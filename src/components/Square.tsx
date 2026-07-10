import type { Cell } from "../types";

type SquareProps = {
  value: Cell;
  onClick: () => void;
  isWinning: boolean;
};

export function Square({ value, onClick, isWinning }: SquareProps) {
  return (
    <button
      className={`square${isWinning ? " square--winning" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
