export type GameStatus = "IN_PROGRESS" | "X_WON" | "O_WON" | "DRAW";

export type Cell = "X" | "O" | null;

export type Game = {
  id: number;
  playerXId: number;
  playerOId: number;
  board: string;
  status: GameStatus;
  createdAt: string;
};

export type Winner = {
  player: Cell;
  line: number[];
};
