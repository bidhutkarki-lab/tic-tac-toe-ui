import { useState } from "react";
import type { SyntheticEvent } from "react";
import { registerPlayer } from "../api";
import type { Player } from "../types";
import { getUserId, getUsername } from "../../../shared/auth";
import logo from "../../../assets/tic_tac_toe.svg";
import "../../users/components/SignupForm.css";

type CreatePlayerFormProps = {
  onCreated: (player: Player) => void;
};

export function CreatePlayerForm({ onCreated }: CreatePlayerFormProps) {
  const [username, setUsername] = useState(getUsername() ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = getUserId();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const player = await registerPlayer({
        profileId: userId ?? undefined,
        username: username.trim(),
      });
      onCreated(player);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = Boolean(username.trim()) && !loading;

  return (
    <form className="signup-card" onSubmit={handleSubmit}>
      <img className="signup-logo" src={logo} alt="Tic Tac Toe logo" />
      <h1 className="signup-title">Create your player</h1>
      <p className="signup-subtitle">Pick a name to play as</p>

      <label className="signup-field">
        <span className="signup-label">
          Player name <span className="required">*</span>
        </span>
        <input
          className="signup-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your player name"
          autoComplete="off"
          required
        />
      </label>

      {error && <div className="signup-error">{error}</div>}
      <button type="submit" className="signup-button" disabled={!canSubmit}>
        {loading ? "Creating…" : "Create Player"}
      </button>
    </form>
  );
}
