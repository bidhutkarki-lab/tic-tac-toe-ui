import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { Game } from "./types";
import { getAccessToken } from "../../shared/auth";

// SockJS needs an absolute http(s) URL. Configurable via VITE_WS_URL so dev
// (backend on :8082) and prod can differ; defaults to the local backend.
const WS_URL =
  import.meta.env.VITE_WS_URL ?? "http://localhost:8080/tic-tac-toe/ws";

// Subscribes to a game's STOMP-over-SockJS broadcast topic for its lifetime.
// Every post-move broadcast delivers the full authoritative Game, handed to
// onGame (feed it into applyGameState). The connection is torn down on unmount
// or when gameId changes. onGame is held in a ref so passing a fresh callback
// each render does not resubscribe.
export function useGameSocket(gameId: number, onGame: (game: Game) => void) {
  const onGameRef = useRef(onGame);
  onGameRef.current = onGame;

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => {
        const token = getAccessToken();
        const url = token
          ? `${WS_URL}?access_token=${encodeURIComponent(token)}`
          : WS_URL;
        return new SockJS(url);
      },
      onConnect: () => {
        client.subscribe(`/topic/games/${gameId}`, (msg) => {
          onGameRef.current(JSON.parse(msg.body) as Game);
        });
      },
    });
    client.activate();
    return () => {
      void client.deactivate();
    };
  }, [gameId]);
}
