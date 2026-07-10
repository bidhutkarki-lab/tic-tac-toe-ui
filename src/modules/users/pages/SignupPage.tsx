import { useNavigate } from "react-router-dom";
import { SignupForm } from "../components/SignupForm";

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="game">
      <SignupForm onRegistered={() => navigate("/")} />
    </div>
  );
}
