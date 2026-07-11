import { useState } from "react";
import type { SyntheticEvent } from "react";
import { registerUser } from "../api";
import type { User } from "../types";
import logo from "../../../assets/tic_tac_toe.svg";
import "./SignupForm.css";

type SignupFormProps = {
  onRegistered: (user: User) => void;
};

export function SignupForm({ onRegistered }: SignupFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
      onRegistered(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    Boolean(
      firstName.trim() &&
        lastName.trim() &&
        username.trim() &&
        email.trim() &&
        password,
    ) && !loading;

  return (
    <form className="signup-card" onSubmit={handleSubmit}>
      <img className="signup-logo" src={logo} alt="Tic Tac Toe logo" />
      <h1 className="signup-title">Create your account</h1>
      <p className="signup-subtitle">Join the game in a few seconds</p>

      <label className="signup-field">
        First Name <span className="required">*</span>
        <input
          className="signup-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          required
        />
      </label>
      <label className="signup-field">
        Last Name <span className="required">*</span>
        <input
          className="signup-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          required
        />
      </label>
      <label className="signup-field">
        Username <span className="required">*</span>
        <input
          className="signup-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </label>
      <label className="signup-field">
        Email <span className="required">*</span>
        <input
          className="signup-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="signup-field">
        Password <span className="required">*</span>
        <input
          className="signup-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="new-password"
          required
        />
      </label>

      {error && <div className="signup-error">{error}</div>}
      <button type="submit" className="signup-button" disabled={!canSubmit}>
        {loading ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
