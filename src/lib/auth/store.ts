// Token persistence. Kept in localStorage so a refresh keeps the session.
// Single source of truth for the API client and the auth provider.

const ACCESS_KEY = "omuz.accessToken";
const REFRESH_KEY = "omuz.refreshToken";

export type Tokens = { accessToken: string; refreshToken: string };

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ accessToken, refreshToken }: Tokens): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, accessToken);
  window.localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}
