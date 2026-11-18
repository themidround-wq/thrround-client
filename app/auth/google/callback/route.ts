import { NextResponse, type NextRequest } from "next/server";
import { ApiError, authRequest } from "@/lib/api";
import { CHALLENGE_COOKIE, OAUTH_COOKIE, SESSION_COOKIE, safeNext, sessionCookie, shortCookie } from "@/lib/session";
import { appOrigin } from "../../origin";

/**
 * Step 2 of "Continue with Google": check state, swap the code for Google's
 * ID token, then sign in with theround-service (POST /auth/google). Users with
 * two-factor on get a challenge instead of a session and go to /login/verify.
 */
export async function GET(request: NextRequest) {
  const origin = appOrigin(request);
  const fail = (error: string) => {
    const res = NextResponse.redirect(new URL(`/login?error=${error}`, origin));
    res.cookies.delete(OAUTH_COOKIE);
    return res;
  };

  const params = request.nextUrl.searchParams;
  if (params.get("error")) return fail("cancelled"); // closed or denied the consent screen

  let saved: { state?: string; next?: string } = {};
  try {
    saved = JSON.parse(request.cookies.get(OAUTH_COOKIE)?.value ?? "{}");
  } catch {}
  const code = params.get("code");
  if (!code || !saved.state || saved.state !== params.get("state")) return fail("state");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("config");

  // Code → tokens. Only the ID token is used; theround-service verifies it.
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${origin}/auth/google/callback`,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  const tokens = (await tokenRes?.json().catch(() => null)) as { id_token?: string } | null;
  if (!tokenRes?.ok || !tokens?.id_token) return fail("google");

  const next = safeNext(saved.next);
  let login;
  try {
    login = await authRequest("/auth/google", { idToken: tokens.id_token });
  } catch (e) {
    if (e instanceof ApiError && e.status === 403) return fail("suspended");
    if (e instanceof ApiError && e.status === 401) return fail("google");
    return fail("unavailable");
  }

  if (login.twoFactorRequired) {
    const res = NextResponse.redirect(new URL(`/login/verify${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`, origin));
    res.cookies.set(CHALLENGE_COOKIE, login.challengeToken, shortCookie(300));
    res.cookies.delete(OAUTH_COOKIE);
    return res;
  }

  const res = NextResponse.redirect(new URL(login.user.onboarded ? next : "/onboarding", origin));
  res.cookies.set(SESSION_COOKIE, login.accessToken, sessionCookie);
  res.cookies.delete(OAUTH_COOKIE);
  return res;
}
