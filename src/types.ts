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

// Render-ready view derived from the authoritative server Game.
export type GameView = {
  game: Game;
  squares: Cell[];
  winner: Winner | null;
  nextPlayer: Exclude<Cell, null>;
  isOver: boolean;
};
