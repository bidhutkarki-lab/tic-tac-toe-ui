import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../assets/tic_tac_toe.svg";
import { registerPlayer } from "../api";
import { getUserId, getUsername } from "../../../shared/auth";
import { createGame } from "../../game/api";
import type { Room } from "../../rooms/types";
import {
  getRole,
  getRoom,
  joinRoom,
  setRoomGame,
  type RoomRole,
} from "../../rooms/api";
import "./LobbyPage.css";

export function LobbyPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null | undefined>(undefined);
  const [role, setRole] = useState<RoomRole | null>(
    roomId ? getRole(roomId) : null,
  );
  const [copied, setCopied] = useState(false);
  const [guestName, setGuestName] = useState(getUsername() ?? "");
  const [joining, setJoining] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = getUserId();

  // Poll the (mock) room store so a host tab sees a guest join and a guest tab
  // sees the game start. Swap for a backend GET / WebSocket later.
  useEffect(() => {
    if (!roomId) return;
    const tick = () => setRoom(getRoom(roomId));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [roomId]);

  // Once the host starts, everyone in the room jumps to the board.
  useEffect(() => {
    if (room && room.gameId != null) navigate(`/game/${room.gameId}`);
  }, [room, navigate]);

  if (!roomId) {
    return (
      <div className="game">
        <div className="error">Missing room id.</div>
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
      const player = await registerPlayer({
        profileId: userId ?? undefined,
        username: guestName.trim(),
      });
      const updated = joinRoom(roomId!, player.id, player.username);
      setRole("guest");
      setRoom(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join the game.");
    } finally {
      setJoining(false);
    }
  }

  async function handleStart() {
    if (!room?.guestPlayerId) return;
    setStarting(true);
    setError(null);
    try {
      const game = await createGame(room.hostPlayerId, room.guestPlayerId);
      setRoom(setRoomGame(roomId!, game.id));
      navigate(`/game/${game.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the game.");
      setStarting(false);
    }
  }

  if (room === undefined) {
    return (
      <div className="game">
        <div className="status">Loading room…</div>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="game">
        <div className="error">This room doesn’t exist or has expired.</div>
        <button className="reset" onClick={() => navigate("/play")}>
          Back to Play
        </button>
      </div>
    );
  }

  const hasGuest = Boolean(room.guestPlayerId);

  // Host: share the link, then start once someone joins.
  if (role === "host") {
    return (
      <div className="game">
        <div className="lobby-card">
          <img className="lobby-logo" src={logo} alt="Tic Tac Toe logo" />
          <h1 className="lobby-title">Waiting Room</h1>

          {!hasGuest ? (
            <>
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
            </>
          ) : (
            <>
              <p className="lobby-joined">
                <strong>{room.guestUsername}</strong> joined your game!
              </p>
              {error && <div className="lobby-error">{error}</div>}
              <button
                className="lobby-button"
                onClick={handleStart}
                disabled={starting}
              >
                {starting ? "Starting…" : "Start game"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Guest who already joined: wait for the host to start.
  if (role === "guest") {
    return (
      <div className="game">
        <div className="lobby-card">
          <img className="lobby-logo" src={logo} alt="Tic Tac Toe logo" />
          <h1 className="lobby-title">You're in!</h1>
          <p className="lobby-subtitle">
            Joined <strong>{room.hostUsername}</strong>'s game.
          </p>
          <div className="lobby-status">
            <span className="lobby-spinner" aria-hidden="true" />
            Waiting for the host to start the game…
          </div>
        </div>
      </div>
    );
  }

  // Visitor opened the link but the room is already full.
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
  const canJoin = Boolean(guestName.trim()) && !joining;
  return (
    <div className="game">
      <form className="lobby-card" onSubmit={handleJoin}>
        <img className="lobby-logo" src={logo} alt="Tic Tac Toe logo" />
        <h1 className="lobby-title">Join Game</h1>
        <p className="lobby-subtitle">
          <strong>{room.hostUsername}</strong> invited you to play tic tac toe.
        </p>

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

        {error && <div className="lobby-error">{error}</div>}
        <button type="submit" className="lobby-button" disabled={!canJoin}>
          {joining ? "Joining…" : "Join game"}
        </button>
      </form>
    </div>
  );
}
