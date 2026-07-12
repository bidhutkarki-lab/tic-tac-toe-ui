import { authHeader, clearTokens, isAuthenticated } from "./auth";

// fetch wrapper that sets JSON content type and attaches the JWT Authorization
// header (when present) to every request. Pass method/body via init as usual.
// On a 401 for an authenticated request, the session is cleared and the user is
// sent to the login page.
export async function apiFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  for (const [key, value] of Object.entries(authHeader())) {
    headers.set(key, value);
  }
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401 && isAuthenticated()) {
    clearTokens();
    window.location.assign("/login");
  }
  return res;
}

// Extracts a human-readable message from a backend error body. The backend
// sometimes nests a JSON-encoded error inside the `message` field, so we
// unwrap it until we reach a plain, displayable string.
export function extractErrorMessage(body: string): string | null {
  let current: unknown = body.trim();
  for (let depth = 0; depth < 5; depth++) {
    if (typeof current !== "string") break;
    const text = current.trim();
    if (!text.startsWith("{") && !text.startsWith("[")) return text || null;
    try {
      current = JSON.parse(text);
    } catch {
      return text || null;
    }
    if (current && typeof current === "object" && "message" in current) {
      current = (current as { message: unknown }).message;
    } else {
      break;
    }
  }
  return typeof current === "string" && current.trim() ? current.trim() : null;
}
