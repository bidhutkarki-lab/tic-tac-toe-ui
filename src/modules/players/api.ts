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
