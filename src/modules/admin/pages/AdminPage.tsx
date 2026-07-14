import { useState } from "react";
import { UsersTab } from "../components/UsersTab";
import { PlayersTab } from "../components/PlayersTab";
import "./AdminPage.css";

type AdminTab = "users" | "players";

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
      </nav>

      {tab === "users" ? <UsersTab /> : <PlayersTab />}
    </div>
  );
}
