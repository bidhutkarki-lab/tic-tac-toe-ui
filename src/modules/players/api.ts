import type { LeaderboardEntry, Player, RegisterPlayerRequest } from "./types";
import { apiFetch, extractErrorMessage } from "../../shared/http";

const PLAYERS_BASE = "/tic-tac-toe/players";
const LEADERBOARD_BASE = "/tic-tac-toe/leaderboard";

export async function registerPlayer(
  req: RegisterPlayerRequest,
): Promise<Player> {
  const res = await apiFetch(`${PLAYERS_BASE}`, {
    method: "POST",
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message = extractErrorMessage(body);
    throw new Error(message ?? "Could not create player. Please try again.");
  }
  return res.json();
}

export async function getPlayer(id: string): Promise<Player> {
  const res = await apiFetch(`${PLAYERS_BASE}/${id}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message = extractErrorMessage(body);
    throw new Error(message ?? "Could not load player. Please try again.");
  }
  return res.json();
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await apiFetch(`${LEADERBOARD_BASE}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message = extractErrorMessage(body);
    throw new Error(message ?? "Could not load leaderboard. Please try again.");
  }
  return res.json();
}
// yet (backend responds 404). Used to skip the create-player step on /play.
export async function getMyPlayer(): Promise<Player | null> {
  const res = await apiFetch(`${PLAYERS_BASE}/me`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message = extractErrorMessage(body);
    throw new Error(message ?? "Could not load your player. Please try again.");
  }
  return res.json();
}
