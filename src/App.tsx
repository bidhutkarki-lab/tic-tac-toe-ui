import { Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./modules/game/pages/HomePage";
import { GamePage } from "./modules/game/pages/GamePage";
import { SignupPage } from "./modules/users/pages/SignupPage";
import { LoginPage } from "./modules/users/pages/LoginPage";
import { AdminPage } from "./modules/admin/pages/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/game/:gameId" element={<GamePage />} />
    </Routes>
  );
}

export default App;
