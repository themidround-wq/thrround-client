import { NextResponse, type NextRequest } from "next/server";
import { CHALLENGE_COOKIE, SESSION_COOKIE } from "./lib/session";

/**
 * Cheap gate on the session cookie. The token itself is checked by
 * theround-service on every call; a 401 there clears it via /auth/signout.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/login/verify") {
    if (hasSession) return NextResponse.redirect(new URL("/", request.url));
    if (!request.cookies.has(CHALLENGE_COOKIE)) return NextResponse.redirect(new URL("/login?error=state", request.url));
    return NextResponse.next();
  }

  if (pathname === "/login") {
    return hasSession ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (hasSession) return NextResponse.next();
  const login = new URL("/login", request.url);
  if (pathname !== "/") login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!auth|_next/static|_next/image|avatars|favicon.ico|.*\\.(?:png|svg|ico|woff2)$).*)"],
};
