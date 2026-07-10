import { useState } from "react";
import type { SyntheticEvent } from "react";
import { registerUser } from "../api";
import type { User } from "../types";

type SignupFormProps = {
  onRegistered: (user: User) => void;
};

export function SignupForm({ onRegistered }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await registerUser({
        email: email.trim(),
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
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
      email.trim() &&
        username.trim() &&
        firstName.trim() &&
        lastName.trim(),
    ) && !loading;

  return (
    <form className="new-game" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <label className="field">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </label>
      <label className="field">
        Username
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </label>
      <label className="field">
        First Name
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />
      </label>
      <label className="field">
        Last Name
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" className="reset" disabled={!canSubmit}>
        {loading ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
