import { useState } from "react";
import "./App.css";
import { createGame, boardToSquares, type Cell, type Game } from "./api";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

type Winner = { player: Cell; line: number[] };

function calculateWinner(squares: Cell[]): Winner | null {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}

type SquareProps = {
  value: Cell;
  onClick: () => void;
  isWinning: boolean;
};

function Square({ value, onClick, isWinning }: SquareProps) {
  return (
    <button
      className={`square${isWinning ? " square--winning" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function NewGameForm({ onCreated }: { onCreated: (game: Game) => void }) {
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const game = await createGame(playerX.trim(), playerO.trim());
      onCreated(game);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = Boolean(playerX.trim() && playerO.trim()) && !loading;

  return (
    <form className="new-game" onSubmit={handleSubmit}>
      <h1>Tic Tac Toe</h1>
      <label className="field">
        Player X
        <input
          value={playerX}
          onChange={(e) => setPlayerX(e.target.value)}
          placeholder="Player X name"
        />
      </label>
      <label className="field">
        Player O
        <input
          value={playerO}
          onChange={(e) => setPlayerO(e.target.value)}
          placeholder="Player O name"
        />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" className="reset" disabled={!canSubmit}>
        {loading ? "Creating…" : "Create Game"}
      </button>
    </form>
  );
}

function GameBoard({ game, onNewGame }: { game: Game; onNewGame: () => void }) {
  const [squares, setSquares] = useState<Cell[]>(() =>
    boardToSquares(game.board),
  );
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  let status: string;
  if (winner) {
    status = `Winner: ${winner.player}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="players">
        Game #{game.id} · X: {game.playerXId} vs O: {game.playerOId}
      </div>
      <div className={`status${winner ? " status--win" : ""}`}>{status}</div>
      <div className="board">
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            onClick={() => handleClick(i)}
            isWinning={winner?.line.includes(i) ?? false}
          />
        ))}
      </div>
      <button onClick={onNewGame} className="reset">
        New Game
      </button>
    </div>
  );
}

function App() {
  const [game, setGame] = useState<Game | null>(null);

  if (!game) {
    return (
      <div className="game">
        <NewGameForm onCreated={setGame} />
      </div>
    );
  }

  return <GameBoard game={game} onNewGame={() => setGame(null)} />;
}

export default App;
