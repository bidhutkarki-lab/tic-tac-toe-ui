import type { RegisterUserRequest, User } from "./types";

const USERS_BASE = "/api/users";

export async function registerUser(req: RegisterUserRequest): Promise<User> {
  const res = await fetch(`${USERS_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Register user failed (${res.status})${detail ? `: ${detail}` : ""}`,
    );
  }
  return res.json();
}
