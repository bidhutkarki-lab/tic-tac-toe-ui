export type Player = {
  id: string;
  username: string;
  createdAt: string;
};

export type RegisterPlayerRequest = {
  username: string;
};

export type LeaderboardEntry = {
  rank: number;
  playerId: string;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
};
