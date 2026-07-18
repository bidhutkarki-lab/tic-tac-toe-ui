import {
  authHeader,
  clearTokens,
  getRefreshToken,
  isAuthenticated,
  storeTokens,
} from "./auth";

function buildHeaders(init: RequestInit): Headers {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  for (const [key, value] of Object.entries(authHeader())) {
    headers.set(key, value);
  }
  return headers;
}

// Shared across callers so that several requests failing with 401 at once only
// trigger a single refresh round-trip rather than one per request.
let refreshInFlight: Promise<boolean> | null = null;

function refreshTokens(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

// Uses raw fetch (not apiFetch) so a 401 from the refresh endpoint itself can't
// recurse back into another refresh attempt.
async function performRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    storeTokens(await res.json());
    return true;
  } catch {
    return false;
  }
}

// fetch wrapper that sets JSON content type and attaches the JWT Authorization
// header (when present) to every request. Pass method/body via init as usual.
// On a 401 for an authenticated request, it first tries to refresh the access
// token and retry once; only if the refresh fails is the session cleared and
// the user sent to the login page.
export async function apiFetch(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  let res = await fetch(input, { ...init, headers: buildHeaders(init) });
  if (res.status === 401 && isAuthenticated()) {
    if (getRefreshToken() && (await refreshTokens())) {
      res = await fetch(input, { ...init, headers: buildHeaders(init) });
      if (res.status !== 401) return res;
    }
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
