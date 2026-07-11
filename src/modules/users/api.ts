import type { LoginRequest, RegisterUserRequest, User } from "./types";
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

// Dummy login: no backend yet. Accepts any non-empty credentials and returns a
// fake user after a short delay to mimic a network request.
export async function loginUser(req: LoginRequest): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!req.identifier.trim() || !req.password) {
    throw new Error("Please enter your credentials.");
  }

  const isEmail = req.identifier.includes("@");
  return {
    id: 1,
    email: isEmail ? req.identifier : `${req.identifier}@example.com`,
    username: isEmail ? req.identifier.split("@")[0] : req.identifier,
    firstName: "Player",
    lastName: "One",
    createdAt: new Date().toISOString(),
  };
}
