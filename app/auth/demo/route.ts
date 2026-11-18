import { NextResponse, type NextRequest } from "next/server";
import { resetStore } from "@/lib/mock/store";
import { DEMO_TOKEN, SESSION_COOKIE, isMock, sessionCookie } from "@/lib/session";

/**
 * Local demo sign-in (MOCK_MODE=1 only): signs in as the seeded user "Nkem".
 * Keeps existing demo data; `?reset=1` reseeds it, `?onboarding=1` starts from a blank account.
 */
export function GET(request: NextRequest) {
  if (!isMock()) return NextResponse.redirect(new URL("/login", request.url));
  const onboarding = request.nextUrl.searchParams.get("onboarding") === "1";
  if (onboarding || request.nextUrl.searchParams.get("reset") === "1") resetStore({ onboarding });
  const res = NextResponse.redirect(new URL(onboarding ? "/onboarding" : "/", request.url));
  res.cookies.set(SESSION_COOKIE, DEMO_TOKEN, sessionCookie);
  return res;
}
