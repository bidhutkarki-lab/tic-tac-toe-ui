const API_BASE = "/api";

export type GameStatus =
  | "IN_PROGRESS"
  | "X_WON"
  | "O_WON"
  | "DRAW";

export type Game = {
  id: number;
  playerXId: number;
  playerOId: number;
  board: string;
  status: GameStatus;
  createdAt: string;
};

export type Cell = "X" | "O" | null;

export async function createGame(
  playerXId: string,
  playerOId: string,
): Promise<Game> {
  const res = await fetch(`${API_BASE}/game`, {
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

// Backend encodes the board as a 9-char string where "-" is an empty cell.
export function boardToSquares(board: string): Cell[] {
  return board.split("").map((cell) => (cell === "-" ? null : (cell as Cell)));
}
