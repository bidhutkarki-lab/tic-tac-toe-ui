import type { AdminUser, Page } from "./types";

const USERS_BASE = "/api/admin/users";

export async function listUsers(
  page = 0,
  size = 20,
): Promise<Page<AdminUser>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const res = await fetch(`${USERS_BASE}?${params}`);
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Load users failed (${res.status})${detail ? `: ${detail}` : ""}`,
    );
  }
  return res.json();
}
