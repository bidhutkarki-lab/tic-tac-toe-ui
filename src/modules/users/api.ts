import type {
  LoginRequest,
  LoginResponse,
  RegisterUserRequest,
  User,
} from "./types";
import { apiFetch, extractErrorMessage } from "../../shared/http";
import { storeTokens, storeUserId, storeUsername } from "../../shared/auth";

const USERS_BASE = "/tic-tac-toe";

export async function registerUser(req: RegisterUserRequest): Promise<User> {
  const res = await apiFetch(`${USERS_BASE}/register`, {
    method: "POST",
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message = extractErrorMessage(body);
    throw new Error(message ?? "Something went wrong. Please try again.");
  }
  const user: User = await res.json();
  storeUserId(String(user.id));
  storeUsername(user.username);
  return user;
}

export async function loginUser(req: LoginRequest): Promise<LoginResponse> {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message = extractErrorMessage(body);
    throw new Error(message ?? "Invalid credentials. Please try again.");
  }
  const tokens: LoginResponse = await res.json();
  storeTokens(tokens);
  return tokens;
}
