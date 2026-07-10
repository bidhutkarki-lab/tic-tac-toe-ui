import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Game } from "../types/types";
import { getGame } from "../api/api";
import { GameBoard } from "../components/GameBoard";

export function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  const loadGame = useCallback(async () => {
    const id = Number(gameId);
    if (!Number.isInteger(id)) {
      setError(`Invalid game id: ${gameId}`);
      return;
    }
    const req = ++requestRef.current;
    setGame(null);
    setError(null);
    try {
      const g = await getGame(id);
      if (req === requestRef.current) setGame(g);
    } catch (err) {
      if (req === requestRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load game");
      }
    }
  }, [gameId]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  if (error) {
    return (
      <div className="game">
        <div className="error">{error}</div>
        <button onClick={() => navigate("/")} className="reset">
          New Game
        </button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game">
        <div className="status">Loading game…</div>
      </div>
    );
  }

  return <GameBoard game={game} onNewGame={() => navigate("/")} />;
}
