import { useEffect, useState } from "react";
import type { Cell, Game } from "../types";
import { applyGameState, submitMove } from "../api";
import { getMyPlayer, getPlayer } from "../../players/api";
import type { Player } from "../../players/types";
import { Board } from "./Board";

type GameBoardProps = {
  game: Game;
  onNewGame: () => void;
};

export function GameBoard({ game: initialGame, onNewGame }: GameBoardProps) {
  const [game, setGame] = useState(initialGame);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [names, setNames] = useState<Record<string, string>>({});
  const [me, setMe] = useState<Player | null>(null);

  // Load the viewer's player so we can enforce turn order.
  useEffect(() => {
    let active = true;
    getMyPlayer()
      .then((p) => active && setMe(p))
      .catch(() => active && setMe(null));
    return () => {
      active = false;
    };
  }, []);

  // Resolve player usernames so the board shows names instead of raw ids.
  useEffect(() => {
    const ids = [game.playerXId, game.playerOId].filter(
      (id): id is number => id != null,
    );
    let active = true;
    Promise.all(
      ids.map((id) =>
        getPlayer(String(id))
          .then((p) => [String(id), p.username] as const)
          .catch(() => [String(id), String(id)] as const),
      ),
    ).then((entries) => {
      if (active) setNames(Object.fromEntries(entries));
    });
    return () => {
      active = false;
    };
  }, [game.playerXId, game.playerOId]);

  const nameFor = (id: number | null) =>
    id == null ? "…" : (names[String(id)] ?? String(id));

  const { squares, winner, nextPlayer, isOver } = applyGameState(game);

  const myMark: Cell = !me
    ? null
    : String(game.playerXId) === me.id
      ? "X"
      : String(game.playerOId) === me.id
        ? "O"
        : null;
  const isMyTurn = myMark != null && myMark === nextPlayer && !isOver;

  let status: string;
  if (winner) {
    status = `Winner: ${winner.player}`;
  } else if (isOver) {
    status = "It's a draw!";
  } else if (isMyTurn) {
    status = "Your turn";
  } else {
    status = `Next player: ${nextPlayer}`;
  }

  async function handleCellClick(i: number) {
    if (squares[i] || isOver || submitting || !isMyTurn) {
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
        Game #{game.id} · X: {nameFor(game.playerXId)} vs O:{" "}
        {nameFor(game.playerOId)}
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
