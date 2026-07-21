// The single fetch entry point for the Revenge CRM API.
// Attaches the bearer token, transparently refreshes it once on a 401, and
// surfaces failures as a typed ApiError so callers can branch on status.

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth/store";
import type { AuthResponse, ProblemDetails } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  readonly status: number;
  readonly problem?: ProblemDetails;

  constructor(status: number, message: string, problem?: ProblemDetails) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  // JSON body; serialized for you. Use `rawBody` for anything else.
  json?: unknown;
  rawBody?: BodyInit;
};

// A single in-flight refresh is shared across concurrent 401s.
let refreshInFlight: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${BASE}/api/Auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return false;
  }

  const data = (await res.json()) as AuthResponse;
  if (data.accessToken && data.refreshToken) {
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return true;
  }
  clearTokens();
  return false;
}

function buildRequest(path: string, options: FetchOptions, token: string | null): Promise<Response> {
  const { json, rawBody, headers, ...rest } = options;
  const finalHeaders = new Headers(headers);

  let body: BodyInit | undefined = rawBody;
  if (json !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }
  if (token) finalHeaders.set("Authorization", `Bearer ${token}`);

  return fetch(`${BASE}${path}`, { ...rest, headers: finalHeaders, body });
}

// A validation 400 only says "One or more validation errors occurred"; the
// useful part is the per-field list, so fold it into the message.
function fieldErrors(problem?: ProblemDetails): string | null {
  const entries = Object.entries(problem?.errors ?? {});
  if (entries.length === 0) return null;

  return entries
    .map(([field, messages]) => `${field}: ${messages.join(" ")}`)
    .join("\n");
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  let res = await buildRequest(path, options, getAccessToken());

  if (res.status === 401 && getRefreshToken()) {
    refreshInFlight ??= refreshTokens();
    const refreshed = await refreshInFlight;
    refreshInFlight = null;
    if (refreshed) {
      res = await buildRequest(path, options, getAccessToken());
    }
  }

  if (!res.ok) {
    let problem: ProblemDetails | undefined;
    try {
      problem = (await res.json()) as ProblemDetails;
    } catch {
      // Non-JSON error body — fall back to the status text.
    }
    const message =
      fieldErrors(problem) ?? problem?.detail ?? problem?.title ?? res.statusText ?? "Request failed";
    throw new ApiError(res.status, message, problem);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError(
      res.status,
      `Backend API server returned HTML instead of JSON (${res.status} ${res.statusText}). Check NEXT_PUBLIC_API_BASE_URL in .env.local`
    );
  }
}

// Serialize list filters into a query string, dropping empty values.
export function toQuery(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
