import { useNavigate } from "react-router-dom";
import { CreatePlayerForm } from "../components/CreatePlayerForm";
import { toaster } from "../../../shared/toaster";

export function PlayPage() {
  const navigate = useNavigate();

  return (
    <div className="game">
      <CreatePlayerForm
        onCreated={(player) => {
          toaster.create({
            title: `You're in, ${player.username}!`,
            description: "Share your game link to invite another player.",
            type: "success",
          });
          navigate(`/lobby/${player.id}`);
        }}
      />
    </div>
  );
}
