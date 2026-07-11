import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { toaster } from "../../../shared/toaster";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="game">
      <LoginForm
        onLoggedIn={() => {
          toaster.create({
            title: "Welcome back!",
            description: "You are now logged in.",
            type: "success",
          });
          navigate("/");
        }}
      />
    </div>
  );
}
