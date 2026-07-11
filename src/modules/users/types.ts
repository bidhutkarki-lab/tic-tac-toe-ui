export type User = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export type RegisterUserRequest = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
};
