export type Player = {
  id: string;
  username: string;
  createdAt: string;
};

export type RegisterPlayerRequest = {
  profileId?: string;
  username: string;
};
