const ACCESS_TOKEN_KEY = "ttt.accessToken";
const REFRESH_TOKEN_KEY = "ttt.refreshToken";
const USER_ID_KEY = "ttt.userId";
const USERNAME_KEY = "ttt.username";

type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

export function storeTokens(tokens: StoredTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeUserId(userId: string): void {
  localStorage.setItem(USER_ID_KEY, userId);
}

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function storeUsername(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function isAuthenticated(): boolean {
  return getAccessToken() != null;
}

export function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
