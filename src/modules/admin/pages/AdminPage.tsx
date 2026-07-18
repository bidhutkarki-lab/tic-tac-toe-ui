import { useState } from "react";
import { UsersTab } from "../components/UsersTab";
import { PlayersTab } from "../components/PlayersTab";
import { ResultsTab } from "../components/ResultsTab";
import "./AdminPage.css";

type AdminTab = "users" | "players" | "results";

export function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("users");

  return (
    <div className="admin-page">
      <nav className="admin-tabs" role="tablist" aria-label="Admin sections">
        <button
          role="tab"
          aria-selected={tab === "users"}
          className={`admin-tab${tab === "users" ? " is-active" : ""}`}
          onClick={() => setTab("users")}
        >
          Users
        </button>
        <button
          role="tab"
          aria-selected={tab === "players"}
          className={`admin-tab${tab === "players" ? " is-active" : ""}`}
          onClick={() => setTab("players")}
        >
          Players
        </button>
        <button
          role="tab"
          aria-selected={tab === "results"}
          className={`admin-tab${tab === "results" ? " is-active" : ""}`}
          onClick={() => setTab("results")}
        >
          Results
        </button>
      </nav>

      {tab === "users" && <UsersTab />}
      {tab === "players" && <PlayersTab />}
      {tab === "results" && <ResultsTab />}
    </div>
  );
}
