import type { Player, RegisterPlayerRequest } from "./types";
import { apiFetch, extractErrorMessage } from "../../shared/http";

const PLAYERS_BASE = "/tic-tac-toe/players";

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

// Returns the player for the authenticated user, or null if they don't have one
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
