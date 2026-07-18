import { useCallback, useEffect, useState } from "react";
import type { GameResult } from "../types";
import { listResults } from "../api";
import { ResultList } from "./ResultList";

export function ResultsTab() {
  const [results, setResults] = useState<GameResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listResults();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results");
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
          <h1 className="admin-title">Results</h1>
          <p className="admin-subtitle">
            {results ? `${results.length} games played` : "\u00A0"}
          </p>
        </div>
        <button className="admin-refresh" onClick={load} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {error && <div className="admin-error">{error}</div>}

      {loading && !results && (
        <div className="admin-status">Loading results…</div>
      )}

      {results && results.length === 0 && (
        <div className="admin-status">No games have been played yet.</div>
      )}

      {results && results.length > 0 && <ResultList results={results} />}
    </>
  );
}
