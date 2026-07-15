import { useState } from "react";
import type { Game } from "../types";
import { applyGameState, submitMove } from "../api";
import { Board } from "./Board";

type GameBoardProps = {
  game: Game;
  onNewGame: () => void;
};

export function GameBoard({ game: initialGame, onNewGame }: GameBoardProps) {
  const [game, setGame] = useState(initialGame);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { squares, winner, nextPlayer, isOver } = applyGameState(game);
  const waitingForOpponent = game.playerOId == null;

  let status: string;
  if (winner) {
    status = `Winner: ${winner.player}`;
  } else if (isOver) {
    status = "It's a draw!";
  } else if (waitingForOpponent) {
    status = "Waiting for an opponent to join…";
  } else {
    status = `Next player: ${nextPlayer}`;
  }

  async function handleCellClick(i: number) {
    if (squares[i] || isOver || submitting) {
      return;
    }
    const playerId = nextPlayer === "X" ? game.playerXId : game.playerOId;
    if (playerId == null) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const updated = await submitMove(game.id, playerId, i);
      setGame(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Move failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="game">
      <div className="players">
        Game #{game.id} · X: {game.playerXId} vs O:{" "}
        {game.playerOId ?? "waiting…"}
      </div>
      <div className={`status${winner ? " status--win" : ""}`}>{status}</div>
      <Board
        squares={squares}
        winningLine={winner?.line ?? []}
        onCellClick={handleCellClick}
      />
      {error && <div className="error">{error}</div>}
      <button onClick={onNewGame} className="reset">
        New Game
      </button>
    </div>
  );
}
