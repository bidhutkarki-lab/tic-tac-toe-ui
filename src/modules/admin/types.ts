export type AdminUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  authId: string;
};

export type GameResult = {
  id: number;
  gameId: number;
  playerId: string;
  outcome: string;
  points: number;
  createdAt: string;
};

export type Page<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
