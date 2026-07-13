import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../assets/tic_tac_toe.svg";
import "./LobbyPage.css";

export function LobbyPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

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
