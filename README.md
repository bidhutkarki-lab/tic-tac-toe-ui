# Tic Tac Toe UI

A real-time, multiplayer tic-tac-toe web client built with **React 19**, **TypeScript**, and **Vite**. Two players compete over a shared board that updates live via WebSockets, with JWT-based authentication, a player lobby with shareable invite links, an ELO-style leaderboard, and an admin dashboard for inspecting users, players, and game results.

This repository is the **frontend only**. It talks to a separate backend (a Spring-style REST + STOMP/WebSocket service) that owns all authoritative game state, authentication, and persistence.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [High-Level Overview](#high-level-overview)
  - [Module Structure](#module-structure)
  - [Routing & Route Guards](#routing--route-guards)
  - [Authentication & Token Refresh](#authentication--token-refresh)
  - [Game State: Single Source of Truth](#game-state-single-source-of-truth)
  - [Real-Time Updates vs. Polling](#real-time-updates-vs-polling)
- [Backend Contract](#backend-contract)
  - [REST Endpoints](#rest-endpoints)
  - [WebSocket Topic](#websocket-topic)
  - [Board Encoding](#board-encoding)
- [Key Design Decisions](#key-design-decisions)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [User Flows](#user-flows)

---

## Features

- **Authentication** — sign up, log in, and log out. Access/refresh JWTs are persisted in `localStorage`, and the app transparently refreshes expired access tokens.
- **Player identity** — a logged-in user creates a lightweight "player" profile the first time they play; the app skips the create-player step on subsequent visits.
- **Lobby / waiting room** — the host creates a game and gets a shareable invite link. A second player opens the link, joins, and the host starts the match.
- **Real-time gameplay** — every move is broadcast over STOMP-over-SockJS, so both boards stay in sync without page refreshes. Turn order is enforced client-side against the authoritative server state.
- **Leaderboard** — ranked standings with rating, wins, losses, draws, and games played; the current player is highlighted.
- **Admin dashboard** — tabbed views for Users (paginated), Players, and Game Results.
- **Resilient UX** — winning-line highlighting, human-readable backend error unwrapping, and toast notifications.

---

## Tech Stack

| Concern            | Choice                                                        |
| ------------------ | ------------------------------------------------------------ |
| Framework          | React 19 (`StrictMode`)                                       |
| Language           | TypeScript 5.9 (`strict`, `noUnusedLocals`, `noUnusedParameters`) |
| Build tool         | Vite 8 (`@vitejs/plugin-react`)                              |
| Routing            | React Router 7 (`BrowserRouter`)                             |
| UI / styling       | Chakra UI 3 + Emotion, Tailwind CSS 4 (`@tailwindcss/vite`), plain CSS |
| Real-time          | `@stomp/stompjs` + `sockjs-client`                          |
| Linting            | Oxlint                                                        |

---

## Architecture

### High-Level Overview

```
                       ┌──────────────────────────────────────────┐
                       │                Browser                     │
                       │                                            │
   ┌───────────────┐   │   React App (Vite)                         │
   │ localStorage  │◄──┼─ shared/auth.ts   (tokens, user identity)  │
   │  ttt.*        │   │   shared/http.ts  (apiFetch + refresh)      │
   └───────────────┘   │   shared/RouteGuards.tsx                    │
                       │        │                    │              │
                       │  REST (apiFetch)      WebSocket (STOMP)     │
                       └────────┼────────────────────┼──────────────┘
                                │                     │
                     /auth/*    │  /tic-tac-toe/*     │ /tic-tac-toe/ws
                                ▼                     ▼
                       ┌──────────────────────────────────────────┐
                       │             Backend service                │
                       │  Auth · Users · Players · Games · Results  │
                       │  STOMP broker → /topic/games/{id}          │
                       └──────────────────────────────────────────┘
```

The frontend holds **no authoritative game logic**. `gameLogic.ts` only *derives* a render view (whose turn it is, winning line, game-over) from the server's `Game`. The server is the source of truth for the board, status, and whose move is valid.

### Module Structure

The code is organized by **feature module** under `src/modules/`, each self-contained with its own `api.ts`, `types.ts`, `components/`, and `pages/`:

- **`users`** — registration, login, logout, and the auth-facing account calls (`/auth/me`, `/tic-tac-toe/users/me`).
- **`players`** — player profile creation, the "my player" lookup, and the leaderboard.
- **`game`** — game creation, joining, starting, moves, board rendering, and the WebSocket subscription.
- **`admin`** — read-only dashboards for users, players, and results.

Cross-cutting concerns live in **`src/shared/`**:

- `auth.ts` — token & identity storage helpers.
- `http.ts` — the `apiFetch` wrapper (auth headers, 401 refresh-and-retry, error unwrapping).
- `RouteGuards.tsx` — `GuestRoute` / `ProtectedRoute` layout routes.
- `toaster.tsx` — Chakra toast instance.

### Routing & Route Guards

Routing is defined in `src/App.tsx`. Two layout routes gate access based on auth state (checked via presence of an access token):

| Route              | Guard            | Purpose                                        |
| ------------------ | ---------------- | ---------------------------------------------- |
| `/signup`, `/login`| `GuestRoute`     | Logged-out only; redirects authed users to `/` |
| `/logout`          | *(none)*         | Clears tokens, then redirects to `/login`      |
| `/`                | `ProtectedRoute` | Redirects to `/play`                           |
| `/play`            | `ProtectedRoute` | Create-game screen + leaderboard               |
| `/lobby/:roomId`   | `ProtectedRoute` | Waiting room / join screen                      |
| `/game/:gameId`    | `ProtectedRoute` | The live board                                 |
| `/admin`           | `ProtectedRoute` | Admin dashboard                                |

### Authentication & Token Refresh

Auth is JWT-based and lives entirely in `localStorage` under the `ttt.*` namespace (`accessToken`, `refreshToken`, `userId`, `username`).

`apiFetch` (in `src/shared/http.ts`) wraps `fetch` and:

1. Sets `Content-Type: application/json` and attaches `Authorization: Bearer <accessToken>` when present.
2. On a `401` for an authenticated request, attempts a **single** token refresh against `/auth/refresh` and retries the original request once.
3. If refresh fails, clears the session and redirects to `/login`.

A shared in-flight refresh promise ensures that many requests failing with `401` simultaneously trigger **one** refresh round-trip rather than a stampede. The refresh call uses raw `fetch` (not `apiFetch`) so a `401` from the refresh endpoint can't recurse.

`extractErrorMessage` unwraps backend error bodies that sometimes nest a JSON-encoded error inside a `message` field, so users see a clean string rather than raw JSON.

### Game State: Single Source of Truth

Every transport that produces a new game state — the response to a move POST, a GET poll, or a WebSocket push — funnels through **`applyGameState(game)`** in `src/modules/game/api.ts`. It converts the authoritative `Game` into a render-ready `GameView`:

```
Game (server) ──► applyGameState ──► GameView { squares, winner, nextPlayer, isOver }
```

This keeps rendering logic in exactly one place and guarantees consistent behavior regardless of how the update arrived.

### Real-Time Updates vs. Polling

The app uses **two different sync strategies**, intentionally:

- **Live board (`/game/:gameId`)** — `useGameSocket` opens a STOMP-over-SockJS connection and subscribes to `/topic/games/{id}`. Each broadcast delivers the full authoritative `Game`, which is fed straight into state. The connection is torn down on unmount or when `gameId` changes, and the `onGame` callback is held in a ref so re-renders don't cause re-subscription.
- **Lobby (`/lobby/:roomId`)** — polls `GET /games/{id}` every second so the host tab notices when a guest joins. This is a deliberate stopgap; the code notes it can be swapped for a WebSocket push later.

---

## Backend Contract

All REST calls are made relative (e.g. `/tic-tac-toe/...`, `/auth/...`) and proxied to the backend in dev (see [Configuration](#configuration)). The base paths are:

- Auth: `/auth`
- App API: `/tic-tac-toe`

### REST Endpoints

| Area      | Method & Path                         | Used by                          |
| --------- | ------------------------------------- | -------------------------------- |
| Auth      | `POST /auth/login`                    | Login                            |
| Auth      | `POST /auth/refresh`                  | Automatic token refresh          |
| Auth      | `GET  /auth/me`                       | Resolve current user id          |
| Users     | `POST /tic-tac-toe/users/register`    | Sign up                          |
| Users     | `GET  /tic-tac-toe/users/me`          | Resolve current username         |
| Players   | `POST /tic-tac-toe/players`           | Create a player                  |
| Players   | `GET  /tic-tac-toe/players`           | List players (admin)             |
| Players   | `GET  /tic-tac-toe/players/{id}`      | Resolve a player's username      |
| Players   | `GET  /tic-tac-toe/players/me`        | Load current user's player (404 ⇒ none) |
| Leaderboard | `GET /tic-tac-toe/leaderboard`      | Leaderboard standings            |
| Games     | `POST /tic-tac-toe/games`             | Create a game                    |
| Games     | `GET  /tic-tac-toe/games/{id}`        | Load / poll a game               |
| Games     | `POST /tic-tac-toe/games/{id}/join`   | Guest joins                      |
| Games     | `POST /tic-tac-toe/games/{id}/start`  | Host starts                      |
| Games     | `POST /tic-tac-toe/games/{id}/moves`  | Submit a move                    |
| Admin     | `GET  /tic-tac-toe/admin/users`       | Paginated user list              |
| Results   | `GET  /tic-tac-toe/results`           | Game results                     |

### WebSocket Topic

- **Endpoint:** `http://localhost:8080/tic-tac-toe/ws` (SockJS handshake; override with `VITE_WS_URL`).
- **Auth:** the access token is passed as an `?access_token=` query parameter on the SockJS URL.
- **Subscription:** `/topic/games/{gameId}` — each message body is a JSON `Game`.

### Board Encoding

The backend represents the board as a **9-character string**, one char per cell in row-major order, with `-` for an empty cell (e.g. `"X--O---X-"`). `boardToSquares` converts this to a `Cell[]` (`"X" | "O" | null`) for rendering. `GameStatus` is one of `READY | IN_PROGRESS | X_WON | O_WON | DRAW`.

---

## Key Design Decisions

- **Feature-module layout.** Each domain (`users`, `players`, `game`, `admin`) owns its API, types, components, and pages, keeping boundaries clear and imports shallow. Truly shared code lives in `src/shared/`.
- **Server-authoritative game state.** The client never mutates the board locally; it always renders what the server returns. `gameLogic.ts` is pure derivation (winner/turn), never a source of truth.
- **One funnel for state (`applyGameState`).** POST responses, polls, and WebSocket pushes all converge on a single function, so the render view is consistent across transports.
- **Single-flight token refresh.** Concurrent `401`s share one refresh promise, avoiding redundant refresh calls and race conditions; the refresh path deliberately bypasses `apiFetch` to prevent recursion.
- **WebSocket for play, polling for lobby.** Live moves need push; the lobby's "did someone join yet?" check is a simpler 1s poll marked for a future WebSocket upgrade.
- **`localStorage`-backed sessions.** Tokens and identity survive reloads and are read synchronously by the route guards, so auth gating needs no async bootstrap.
- **SockJS `global` shim.** `sockjs-client` references Node's `global`, undefined in browsers, so Vite defines `global: "globalThis"`.
- **Graceful degradation.** The leaderboard is treated as non-critical — if it fails to load, the play screen still works.
- **Human-readable errors.** `extractErrorMessage` unwraps nested JSON error bodies so toasts and inline errors show clean text.

---

## Getting Started

### Prerequisites

- Node.js 20+ (Vite 8 / React 19)
- npm
- The backend service running locally on `http://localhost:8080` (REST + WebSocket)

### Install & Run

```bash
npm install
npm run dev
```

The dev server starts on Vite's default port (`http://localhost:5173`) and proxies API calls to the backend (see below).

---

## Configuration

### Dev Proxy

`vite.config.ts` proxies REST traffic to the backend so the frontend can use relative URLs and avoid CORS in development:

```ts
server: {
  proxy: {
    "/tic-tac-toe": { target: "http://localhost:8080", changeOrigin: true },
    "/auth":        { target: "http://localhost:8080", changeOrigin: true },
  },
}
```

### Environment Variables

| Variable      | Default                                       | Purpose                          |
| ------------- | --------------------------------------------- | -------------------------------- |
| `VITE_WS_URL` | `http://localhost:8080/tic-tac-toe/ws`        | SockJS/STOMP WebSocket endpoint  |

The WebSocket connection is **not** routed through the Vite proxy — it uses an absolute URL (SockJS requires one), so point `VITE_WS_URL` at the backend directly per environment.

---

## Available Scripts

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR             |
| `npm run build`     | Type-check (`tsc -b`) then build for production |
| `npm run typecheck` | Run the TypeScript project build (type-check)  |
| `npm run lint`      | Run Oxlint                                      |
| `npm run preview`   | Preview the production build locally            |

---

## Project Structure

```
src/
├── App.tsx                 # Route definitions + guards
├── main.tsx                # App bootstrap (Chakra, Router, Toaster)
├── modules/
│   ├── users/              # Auth: signup, login, logout
│   │   ├── api.ts          # register / login / auth-me / users-me
│   │   ├── types.ts
│   │   ├── components/     # LoginForm, SignupForm
│   │   └── pages/          # LoginPage, SignupPage, LogoutPage
│   ├── players/            # Player identity + leaderboard
│   │   ├── api.ts          # registerPlayer / getPlayer / getMyPlayer / getLeaderboard
│   │   ├── components/     # CreatePlayerForm, Leaderboard
│   │   └── pages/          # LobbyPage
│   ├── game/               # Gameplay
│   │   ├── api.ts          # create/join/start/move/get + applyGameState
│   │   ├── gameLogic.ts    # winner detection, board decoding (pure)
│   │   ├── socket.ts       # useGameSocket (STOMP over SockJS)
│   │   ├── types.ts        # Game, GameView, Cell, GameStatus
│   │   ├── components/     # Board, Square, GameBoard
│   │   └── pages/          # CreateGamePage, GamePage
│   └── admin/              # Admin dashboard
│       ├── api.ts          # listUsers / listPlayers / listResults
│       ├── components/     # UsersTab, PlayersTab, ResultsTab + lists
│       └── pages/          # AdminPage
└── shared/
    ├── auth.ts             # token & identity storage
    ├── http.ts             # apiFetch, refresh, error unwrapping
    ├── RouteGuards.tsx     # GuestRoute / ProtectedRoute
    └── toaster.tsx         # Chakra toaster
```

---

## User Flows

**Host starts a game**

1. Log in → redirected to `/play`.
2. First-time players create a player profile; returning players skip this.
3. Click **Start Game** → `POST /games` → navigate to `/lobby/{id}`.
4. Share the invite link; the lobby polls until a guest joins.
5. Click **Start game** → `POST /games/{id}/start` → navigate to `/game/{id}`.

**Guest joins**

1. Open the shared `/lobby/{roomId}` link.
2. Enter a name (or reuse the existing player) → `POST /games/{id}/join`.
3. Wait in the room until the host starts; then everyone jumps to the board.

**Playing**

1. `GamePage` loads the game once, then `GameBoard` subscribes to `/topic/games/{id}`.
2. On your turn, click a cell → `POST /games/{id}/moves`; the authoritative `Game` comes back and is also broadcast to the opponent.
3. The board highlights the winning line and shows the final result; **New Game** returns to `/play`.
```
