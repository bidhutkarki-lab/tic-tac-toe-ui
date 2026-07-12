import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./auth";

// Layout route for pages meant only for logged-out users (login, signup).
// Redirects authenticated users to the home page.
export function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

// Layout route for pages that require authentication.
// Redirects logged-out users to the login page.
export function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
