import { useState } from "react";
import type { SyntheticEvent } from "react";
import { loginUser } from "../api";
import type { User } from "../types";
import logo from "../../../assets/tic_tac_toe.svg";
import "./SignupForm.css";

type LoginFormProps = {
  onLoggedIn: (user: User) => void;
};

export function LoginForm({ onLoggedIn }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser({
        identifier: identifier.trim(),
        password,
      });
      onLoggedIn(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = Boolean(identifier.trim() && password) && !loading;

  return (
    <form className="signup-card" onSubmit={handleSubmit}>
      <img className="signup-logo" src={logo} alt="Tic Tac Toe logo" />
      <h1 className="signup-title">Welcome back</h1>
      <p className="signup-subtitle">Log in to keep playing</p>

      <label className="signup-field">
        <span className="signup-label">
          Email <span className="required">*</span>
        </span>
        <input
          className="signup-input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com"
          autoComplete="username"
          required
        />
      </label>
      <label className="signup-field">
        <span className="signup-label">
          Password <span className="required">*</span>
        </span>
        <input
          className="signup-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
        />
      </label>

      {error && <div className="signup-error">{error}</div>}
      <button type="submit" className="signup-button" disabled={!canSubmit}>
        {loading ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
