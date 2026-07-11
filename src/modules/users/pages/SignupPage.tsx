import { useNavigate } from "react-router-dom";
import { SignupForm } from "../components/SignupForm";
import { toaster } from "../../../shared/toaster";

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="game">
      <SignupForm
        onRegistered={(user) => {
          toaster.create({
            title: `Welcome, ${user.firstName}!`,
            description: "Your account was created.",
            type: "success",
          });
          navigate("/");
        }}
      />
    </div>
  );
}
