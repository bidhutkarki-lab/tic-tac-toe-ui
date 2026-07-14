import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePlayerForm } from "../components/CreatePlayerForm";
import { toaster } from "../../../shared/toaster";
import { createRoom } from "../../rooms/api";
import { getMyPlayer } from "../api";
import type { Player } from "../types";

export function PlayPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function enterLobby(player: Player, replace: boolean) {
    const room = createRoom(player.id, player.username);
    navigate(`/lobby/${room.roomId}`, { replace });
  }

  // If the user already has a player, skip the form and go straight in.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const player = await getMyPlayer();
        if (!active) return;
        if (player) {
          enterLobby(player, true);
          return;
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      }
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="game">
        <div className="status">Checking your player…</div>
      </div>
    );
  }

  return (
    <div className="game">
      {error && <div className="error">{error}</div>}
      <CreatePlayerForm
        onCreated={(player) => {
          toaster.create({
            title: `You're in, ${player.username}!`,
            description: "Share your game link to invite another player.",
            type: "success",
          });
          enterLobby(player, false);
        }}
      />
    </div>
  );
}
