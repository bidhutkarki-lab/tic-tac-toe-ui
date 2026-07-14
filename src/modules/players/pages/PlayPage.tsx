import { useNavigate } from "react-router-dom";
import { CreatePlayerForm } from "../components/CreatePlayerForm";
import { toaster } from "../../../shared/toaster";
import { createRoom } from "../../rooms/api";

export function PlayPage() {
  const navigate = useNavigate();

  return (
    <div className="game">
      <CreatePlayerForm
        onCreated={(player) => {
          const room = createRoom(player.id, player.username);
          toaster.create({
            title: `You're in, ${player.username}!`,
            description: "Share your game link to invite another player.",
            type: "success",
          });
          navigate(`/lobby/${room.roomId}`);
        }}
      />
    </div>
  );
}
