import { useState } from "react";
import type { Cell, Game } from "../types";
import { calculateWinner, boardToSquares } from "../gameLogic";
import { Board } from "./Board";

type GameBoardProps = {
  game: Game;
  onNewGame: () => void;
};

export function GameBoard({ game, onNewGame }: GameBoardProps) {
  const [squares, setSquares] = useState<Cell[]>(() =>
    boardToSquares(game.board),
  );
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  let status: string;
  if (winner) {
    status = `Winner: ${winner.player}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function handleCellClick(i: number) {
    if (squares[i] || winner) {
      return;
    }
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="players">
        Game #{game.id} · X: {game.playerXId} vs O: {game.playerOId}
      </div>
      <div className={`status${winner ? " status--win" : ""}`}>{status}</div>
      <Board
        squares={squares}
        winningLine={winner?.line ?? []}
        onCellClick={handleCellClick}
      />
      <button onClick={onNewGame} className="reset">
        New Game
      </button>
    </div>
  );
}
