import { NextResponse, type NextRequest } from "next/server";
import { CHALLENGE_COOKIE, SESSION_COOKIE } from "@/lib/session";

/**
 * Where apiFetch sends people when the API rejects their token (401) or their
 * account is suspended (403): clear the cookie, then show why on /login.
 * Deliberate sign-out uses the signOut server action instead.
 */
export function GET(request: NextRequest) {
  const reason = request.nextUrl.searchParams.get("reason");
  const login = new URL("/login", request.url);
  if (reason === "expired" || reason === "suspended") login.searchParams.set("error", reason);
  const res = NextResponse.redirect(login);
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(CHALLENGE_COOKIE);
  return res;
}
