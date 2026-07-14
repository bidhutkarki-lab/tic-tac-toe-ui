import type { AdminUser, Page } from "./types";
import type { Player } from "../players/types";
import { apiFetch, extractErrorMessage } from "../../shared/http";

const USERS_BASE = "/tic-tac-toe/admin/users";
const PLAYERS_BASE = "/tic-tac-toe/players";

export async function listUsers(
  page = 0,
  size = 20,
): Promise<Page<AdminUser>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const res = await apiFetch(`${USERS_BASE}?${params}`);
  if (!res.ok) {
    const message = extractErrorMessage(await res.text().catch(() => ""));
    throw new Error(message ?? "Load users failed. Please try again.");
  }
  return res.json();
}

export async function listPlayers(): Promise<Player[]> {
  const res = await apiFetch(`${PLAYERS_BASE}`);
  if (!res.ok) {
    const message = extractErrorMessage(await res.text().catch(() => ""));
    throw new Error(message ?? "Load players failed. Please try again.");
  }
  return res.json();
}
