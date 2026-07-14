export type Room = {
  roomId: string;
  hostPlayerId: string;
  hostUsername: string;
  guestPlayerId?: string;
  guestUsername?: string;
  gameId?: number;
};
