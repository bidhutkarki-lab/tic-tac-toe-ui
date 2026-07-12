import type { Cell, Game, GameView } from "./types";
import { boardToSquares, calculateWinner } from "./gameLogic";
import { apiFetch, extractErrorMessage } from "../../shared/http";

const API_BASE = "/tic-tac-toe/games";

async function asGame(res: Response, action: string): Promise<Game> {
  if (!res.ok) {
    const message = extractErrorMessage(await res.text().catch(() => ""));
    throw new Error(message ?? `${action} failed. Please try again.`);
  }
  return res.json();
}

export async function createGame(
  playerXId: string,
  playerOId: string,
): Promise<Game> {
  const res = await apiFetch(`${API_BASE}`, {
    method: "POST",
    body: JSON.stringify({ playerXId, playerOId }),
  });
  return asGame(res, "Create game");
}

export async function submitMove(
  gameId: number,
  playerId: number,
  cell: number,
): Promise<Game> {
  const res = await apiFetch(`${API_BASE}/${gameId}/moves`, {
    method: "POST",
    body: JSON.stringify({ playerId, cell }),
  });
  return asGame(res, "Submit move");
}

export async function getGame(gameId: number): Promise<Game> {
  const res = await apiFetch(`${API_BASE}/${gameId}`);
  return asGame(res, "Load game");
}

// Single funnel for authoritative state: every transport (POST move response,
// GET poll, future WebSocket push) hands its Game here to produce the render view.
export function applyGameState(game: Game): GameView {
  const squares = boardToSquares(game.board);
  const xCount = squares.filter((c: Cell) => c === "X").length;
  const oCount = squares.filter((c: Cell) => c === "O").length;
  return {
    game,
    squares,
    winner: calculateWinner(squares),
    nextPlayer: xCount === oCount ? "X" : "O",
    isOver: game.status !== "IN_PROGRESS",
  };
}
