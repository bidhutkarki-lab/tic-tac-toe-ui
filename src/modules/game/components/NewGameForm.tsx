import { useState } from "react";
import type { SyntheticEvent } from "react";
import { createGame } from "../api";
import type { Game } from "../types";

type NewGameFormProps = {
  onCreated: (game: Game) => void;
};

export function NewGameForm({ onCreated }: NewGameFormProps) {
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const game = await createGame(playerX.trim(), playerO.trim());
      onCreated(game);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = Boolean(playerX.trim() && playerO.trim()) && !loading;

  return (
    <form className="new-game" onSubmit={handleSubmit}>
      <h1>Tic Tac Toe</h1>
      <label className="field">
        Player X
        <input
          value={playerX}
          onChange={(e) => setPlayerX(e.target.value)}
          placeholder="Player X name"
        />
      </label>
      <label className="field">
        Player O
        <input
          value={playerO}
          onChange={(e) => setPlayerO(e.target.value)}
          placeholder="Player O name"
        />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" className="reset" disabled={!canSubmit}>
        {loading ? "Creating…" : "Create Game"}
      </button>
    </form>
  );
}
