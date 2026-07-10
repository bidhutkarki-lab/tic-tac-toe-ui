import type { Cell } from "../types";
import { Square } from "./Square";

type BoardProps = {
  squares: Cell[];
  winningLine: number[];
  onCellClick: (index: number) => void;
};

export function Board({ squares, winningLine, onCellClick }: BoardProps) {
  return (
    <div className="board">
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          onClick={() => onCellClick(i)}
          isWinning={winningLine.includes(i)}
        />
      ))}
    </div>
  );
}
