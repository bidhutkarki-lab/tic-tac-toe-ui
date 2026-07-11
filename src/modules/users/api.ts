import type {
  LoginRequest,
  LoginResponse,
  RegisterUserRequest,
  User,
} from "./types";
import { extractErrorMessage } from "../../shared/http";
import { storeTokens } from "../../shared/auth";

const USERS_BASE = "/tic-tac-toe";

export async function registerUser(req: RegisterUserRequest): Promise<User> {
  const res = await fetch(`${USERS_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const message = extractErrorMessage(body);
    throw new Error(message ?? "Something went wrong. Please try again.");
  }
  return res.json();
}

export async function loginUser(req: LoginRequest): Promise<LoginResponse> {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
