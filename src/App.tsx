import { useState } from "react";
import "./App.css";
import type { Game } from "./types";
import { NewGameForm } from "./components/NewGameForm";
import { GameBoard } from "./components/GameBoard";

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
