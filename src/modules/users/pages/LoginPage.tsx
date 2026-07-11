import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { toaster } from "../../../shared/toaster";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="game">
      <LoginForm
        onLoggedIn={(user) => {
          toaster.create({
            title: `Welcome back, ${user.firstName}!`,
            description: "You are now logged in.",
            type: "success",
          });
          navigate("/");
        }}
      />
    </div>
  );
}
