import type { Game } from "./types";

const API_BASE = "/api";

export async function createGame(
  playerXId: string,
  playerOId: string,
): Promise<Game> {
  const res = await fetch(`${API_BASE}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerXId, playerOId }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Failed to create game (${res.status})${detail ? `: ${detail}` : ""}`,
    );
  }

  return res.json();
}
