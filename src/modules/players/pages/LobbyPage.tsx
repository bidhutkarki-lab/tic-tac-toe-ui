import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../assets/tic_tac_toe.svg";
import { getMyPlayer, registerPlayer } from "../api";
import { getUsername } from "../../../shared/auth";
import { getGame, joinGame } from "../../game/api";
import type { Game } from "../../game/types";
import type { Player } from "../types";
import "./LobbyPage.css";

export function LobbyPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const gameId = Number(roomId);

  const [game, setGame] = useState<Game | null | undefined>(undefined);
  const [me, setMe] = useState<Player | null>(null);
  const [meLoaded, setMeLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [guestName, setGuestName] = useState(getUsername() ?? "");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the current user's player once so we can tell host from guest.
  useEffect(() => {
    let active = true;
    getMyPlayer()
      .then((p) => active && setMe(p))
      .catch(() => active && setMe(null))
      .finally(() => active && setMeLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  // A room only exists when there is a valid game. Poll it so a host tab sees a
  // guest join. Swap for a backend WebSocket push later.
  useEffect(() => {
    if (!Number.isInteger(gameId)) return;
    let active = true;
    const tick = async () => {
      try {
        const g = await getGame(gameId);
        if (active) setGame(g);
      } catch {
        if (active) setGame(null);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [gameId]);

  // Once the second player has joined, everyone jumps to the board.
  useEffect(() => {
    if (game && game.playerOId != null) navigate(`/game/${game.id}`);
  }, [game, navigate]);

  if (!roomId || !Number.isInteger(gameId)) {
    return (
      <div className="game">
        <div className="error">Missing game id.</div>
        <button className="reset" onClick={() => navigate("/play")}>
          Back to Play
        </button>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/lobby/${roomId}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleJoin(e: SyntheticEvent) {
    e.preventDefault();
    setJoining(true);
    setError(null);
    try {
      const player =
        me ?? (await registerPlayer({ username: guestName.trim() }));
      const updated = await joinGame(gameId, player.id);
      setMe(player);
      setGame(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join the game.");
    } finally {
      setJoining(false);
    }
  }

  if (game === undefined || !meLoaded) {
    return (
      <div className="game">
        <div className="status">Loading room…</div>
      </div>
    );
  }

  if (game === null) {
    return (
      <div className="game">
        <div className="error">This room doesn’t exist or has expired.</div>
        <button className="reset" onClick={() => navigate("/play")}>
          Back to Play
        </button>
      </div>
    );
  }

  const isHost = Boolean(me) && String(game.playerXId) === me!.id;
  const hasGuest = game.playerOId != null;

  // Host: share the link and wait for someone to join.
  if (isHost) {
    return (
      <div className="game">
        <div className="lobby-card">
          <img className="lobby-logo" src={logo} alt="Tic Tac Toe logo" />
          <h1 className="lobby-title">Waiting Room</h1>
          <p className="lobby-subtitle">
            Share this link to invite another player to your game.
          </p>
          <div className="lobby-share">
            <input
              className="lobby-url"
              value={shareUrl}
              readOnly
              onFocus={(e) => e.target.select()}
              aria-label="Game invite link"
            />
            <button className="lobby-copy" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="lobby-status">
            <span className="lobby-spinner" aria-hidden="true" />
            Waiting for another player to join…
          </div>
        </div>
      </div>
    );
  }

  // Visitor opened the link but the game is already full.
  if (hasGuest) {
    return (
      <div className="game">
        <div className="lobby-card">
          <img className="lobby-logo" src={logo} alt="Tic Tac Toe logo" />
          <h1 className="lobby-title">Room full</h1>
          <p className="lobby-subtitle">This game already has two players.</p>
          <button className="reset" onClick={() => navigate("/play")}>
            Start your own game
          </button>
        </div>
      </div>
    );
  }

  // Visitor opened the link: let them join as the second player.
  const canJoin = Boolean(me) || (Boolean(guestName.trim()) && !joining);
  return (
    <div className="game">
      <form className="lobby-card" onSubmit={handleJoin}>
        <img className="lobby-logo" src={logo} alt="Tic Tac Toe logo" />
        <h1 className="lobby-title">Join Game</h1>
        <p className="lobby-subtitle">
          You've been invited to play tic tac toe.
        </p>

        {!me && (
          <label className="lobby-field">
            <span className="lobby-field-label">Your name</span>
            <input
              className="lobby-input"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your player name"
              autoComplete="off"
              required
            />
          </label>
        )}

        {error && <div className="lobby-error">{error}</div>}
        <button type="submit" className="lobby-button" disabled={!canJoin}>
          {joining ? "Joining…" : "Join game"}
        </button>
      </form>
    </div>
  );
}
