import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { clearTokens } from "../../../shared/auth";
import { toaster } from "../../../shared/toaster";

export function LogoutPage() {
  const didLogout = useRef(false);

  useEffect(() => {
    if (didLogout.current) {
      return;
    }
    didLogout.current = true;
    clearTokens();
    toaster.create({
      title: "Signed out",
      description: "You have been logged out.",
      type: "success",
    });
  }, []);

  return <Navigate to="/login" replace />;
}
