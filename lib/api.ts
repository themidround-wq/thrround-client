// Server-side calls to theround-service. Import only from Server Components,
// Server Actions and route handlers: the token lives in an httpOnly cookie and
// never reaches the browser (same pattern as theround-admin/lib/api.ts).

import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { mockApi } from "./mock/api";
import { SESSION_COOKIE, isMock } from "./session";
import type { LoginResponse, Me } from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** theround-service base URL, including the /api prefix. */
export function apiUrl(path: string) {
  const base = process.env.THEROUND_API_URL;
  if (!base) throw new Error("Missing THEROUND_API_URL environment variable.");
  return `${base.replace(/\/+$/, "")}${path}`;
}

type Query = Record<string, string | number | undefined | null>;

async function messageOf(res: Response) {
  const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
  const m = body?.message;
  return (Array.isArray(m) ? m.join(". ") : m) || `Request failed (${res.status})`;
}

/**
 * Authenticated call to the user API. A 401 means the session ended; a 403
 * means the account is suspended. Both go through /auth/signout, which clears
 * the cookie and lands on /login with a notice.
 */
export async function apiFetch<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; query?: Query; raw?: boolean; timeoutMs?: number } = {},
): Promise<T> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");
  if (isMock()) {
    await connection(); // mock data uses the clock; keep it out of prerendering
    return mockApi<T>(path, opts);
  }

  const url = new URL(apiUrl(path));
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }

  const isForm = opts.body instanceof FormData;
  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(opts.body !== undefined && !isForm ? { "Content-Type": "application/json" } : {}),
    },
    body: opts.body === undefined ? undefined : isForm ? (opts.body as FormData) : JSON.stringify(opts.body),
    cache: "no-store",
    signal: AbortSignal.timeout(opts.timeoutMs ?? 20_000),
  });

  if (res.status === 401) redirect("/auth/signout?reason=expired");
  if (res.status === 403) redirect("/auth/signout?reason=suspended");
  if (!res.ok) throw new ApiError(res.status, await messageOf(res));
  if (opts.raw) return res as T;
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Unauthenticated sign-in calls: POST /auth/google and POST /auth/2fa. */
export async function authRequest(path: "/auth/google" | "/auth/2fa", body: Record<string, string>) {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new ApiError(res.status, await messageOf(res));
  return (await res.json()) as LoginResponse;
}

/** The signed-in user and stats, fetched once per request. */
export const getMe = cache(() => apiFetch<Me>("/me"));
