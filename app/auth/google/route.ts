import { NextResponse, type NextRequest } from "next/server";
import { OAUTH_COOKIE, safeNext, shortCookie } from "@/lib/session";
import { appOrigin } from "../origin";

/**
 * Step 1 of "Continue with Google": send the browser to Google's consent
 * screen (OAuth 2.0 authorization code flow, OpenID scopes). The callback
 * exchanges the code for an ID token and hands it to theround-service.
 */
export function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return NextResponse.redirect(new URL("/login?error=config", request.url));

  const state = crypto.randomUUID();
  const next = safeNext(request.nextUrl.searchParams.get("next"));

  const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  google.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${appOrigin(request)}/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  }).toString();

  const res = NextResponse.redirect(google);
  res.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, next }), shortCookie(600));
  return res;
}
