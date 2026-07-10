import { useNavigate } from "react-router-dom";
import { NewGameForm } from "../components/NewGameForm";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="game">
      <NewGameForm onCreated={(game) => navigate(`/game/${game.id}`)} />
    </div>
  );
}
