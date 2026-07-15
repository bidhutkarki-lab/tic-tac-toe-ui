import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { CreateGamePage } from "./modules/game/pages/CreateGamePage";
import { GamePage } from "./modules/game/pages/GamePage";
import { SignupPage } from "./modules/users/pages/SignupPage";
import { LoginPage } from "./modules/users/pages/LoginPage";
import { LogoutPage } from "./modules/users/pages/LogoutPage";
import { AdminPage } from "./modules/admin/pages/AdminPage";
import { LobbyPage } from "./modules/players/pages/LobbyPage";
import { GuestRoute, ProtectedRoute } from "./shared/RouteGuards";

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/logout" element={<LogoutPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/play" replace />} />
        <Route path="/play" element={<CreateGamePage />} />
        <Route path="/lobby/:roomId" element={<LobbyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Route>
    </Routes>
  );
}

export default App;
