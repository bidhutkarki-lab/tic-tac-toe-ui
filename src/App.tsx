import { Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./modules/game/pages/HomePage";
import { GamePage } from "./modules/game/pages/GamePage";
import { SignupPage } from "./modules/users/pages/SignupPage";
import { LoginPage } from "./modules/users/pages/LoginPage";
import { AdminPage } from "./modules/admin/pages/AdminPage";
import { GuestRoute, ProtectedRoute } from "./shared/RouteGuards";

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Route>
    </Routes>
  );
}

export default App;
