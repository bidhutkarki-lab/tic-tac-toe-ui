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
  const res = await apiFetch(`${USERS_BASE}/users/register`, {
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
  const { id } = await fetchAuthMe();
  const { username } = await fetchCurrentUsername();
  storeUserId(String(id));
  storeUsername(username);
  return tokens;
}

async function fetchAuthMe(): Promise<{ id: number }> {
  const res = await apiFetch("/auth/me");
  if (!res.ok) {
    const message = extractErrorMessage(await res.text().catch(() => ""));
    throw new Error(message ?? "Could not load your account. Please try again.");
  }
  return res.json();
}

async function fetchCurrentUsername(): Promise<{ username: string }> {
  const res = await apiFetch("/tic-tac-toe/users/me");
  if (!res.ok) {
    const message = extractErrorMessage(await res.text().catch(() => ""));
    throw new Error(message ?? "Could not load your account. Please try again.");
  }
  return res.json();
}
