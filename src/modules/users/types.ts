export type User = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export type RegisterUserRequest = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};
