import { useCallback, useEffect, useState } from "react";
import type { Player } from "../../players/types";
import { listPlayers } from "../api";
import { PlayerList } from "./PlayerList";

export function PlayersTab() {
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPlayers();
      setPlayers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load players");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Players</h1>
          <p className="admin-subtitle">
            {players ? `${players.length} registered` : "\u00A0"}
          </p>
        </div>
        <button className="admin-refresh" onClick={load} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {error && <div className="admin-error">{error}</div>}

      {loading && !players && (
        <div className="admin-status">Loading players…</div>
      )}

      {players && players.length === 0 && (
        <div className="admin-status">No players have registered yet.</div>
      )}

      {players && players.length > 0 && <PlayerList players={players} />}
    </>
  );
}
