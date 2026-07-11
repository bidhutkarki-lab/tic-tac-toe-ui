import type { RegisterUserRequest, User } from "./types";
import { extractErrorMessage } from "../../shared/http";

const USERS_BASE = "/api/users";

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
