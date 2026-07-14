import type { Room } from "./types";

// TEMPORARY mock room store. Rooms are kept in localStorage so multiple tabs in
// the same browser stay in sync (a host tab can see a guest join). The current
// tab's role is kept in sessionStorage so two tabs can hold different roles.
// Replace these with real backend calls (POST /rooms, POST /rooms/:id/join,
// GET /rooms/:id) later — the LobbyPage only depends on these function shapes.

const ROOMS_KEY = "ttt.rooms";
const ROLE_PREFIX = "ttt.roomRole.";

export type RoomRole = "host" | "guest";

type RoomMap = Record<string, Room>;

function readRooms(): RoomMap {
  try {
    return JSON.parse(localStorage.getItem(ROOMS_KEY) ?? "{}") as RoomMap;
  } catch {
    return {};
  }
}

function writeRooms(rooms: RoomMap): void {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

function newRoomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

export function createRoom(hostPlayerId: string, hostUsername: string): Room {
  const rooms = readRooms();
  const room: Room = { roomId: newRoomId(), hostPlayerId, hostUsername };
  rooms[room.roomId] = room;
  writeRooms(rooms);
  setRole(room.roomId, "host");
  return room;
}

export function getRoom(roomId: string): Room | null {
  return readRooms()[roomId] ?? null;
}

export function joinRoom(
  roomId: string,
  guestPlayerId: string,
  guestUsername: string,
): Room {
  const rooms = readRooms();
  const room = rooms[roomId];
  if (!room) throw new Error("Room not found.");
  room.guestPlayerId = guestPlayerId;
  room.guestUsername = guestUsername;
  rooms[roomId] = room;
  writeRooms(rooms);
  setRole(roomId, "guest");
  return room;
}

export function setRoomGame(roomId: string, gameId: number): Room {
  const rooms = readRooms();
  const room = rooms[roomId];
  if (!room) throw new Error("Room not found.");
  room.gameId = gameId;
  rooms[roomId] = room;
  writeRooms(rooms);
  return room;
}

export function setRole(roomId: string, role: RoomRole): void {
  sessionStorage.setItem(ROLE_PREFIX + roomId, role);
}

export function getRole(roomId: string): RoomRole | null {
  return (sessionStorage.getItem(ROLE_PREFIX + roomId) as RoomRole) ?? null;
}
