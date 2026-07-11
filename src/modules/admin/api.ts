import type { AdminUser, Page } from "./types";
import { extractErrorMessage } from "../../shared/http";

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
    const message = extractErrorMessage(await res.text().catch(() => ""));
    throw new Error(message ?? "Load users failed. Please try again.");
  }
  return res.json();
}
