import { Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./modules/game/pages/HomePage";
import { GamePage } from "./modules/game/pages/GamePage";
import { SignupPage } from "./modules/users/pages/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/game/:gameId" element={<GamePage />} />
    </Routes>
  );
}

export default App;
