import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePlayerForm } from "../../players/components/CreatePlayerForm";
import { toaster } from "../../../shared/toaster";
import { createGame } from "../api";
import { getMyPlayer } from "../../players/api";
import type { Player } from "../../players/types";

export function CreateGamePage() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the existing player (if any) so we can skip the create-player step.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const existing = await getMyPlayer();
        if (active) setPlayer(existing);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function startGame(playerX: Player) {
    setStarting(true);
    setError(null);
    try {
      const game = await createGame(playerX.id);
      navigate(`/lobby/${game.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="game">
        <div className="status">Checking your player…</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="game">
        {error && <div className="error">{error}</div>}
        <CreatePlayerForm
          onCreated={(created) => {
            toaster.create({
              title: `You're in, ${created.username}!`,
              description: "Start a game and invite an opponent to join.",
              type: "success",
            });
            setPlayer(created);
          }}
        />
      </div>
    );
  }

  return (
    <div className="game">
      <form
        className="new-game"
        onSubmit={(e) => {
          e.preventDefault();
          startGame(player);
        }}
      >
        <h1>New Game</h1>
        <p className="status">
          Playing as <strong>{player.username}</strong> (X)
        </p>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="reset" disabled={starting}>
          {starting ? "Starting…" : "Start Game"}
        </button>
      </form>
    </div>
  );
}
