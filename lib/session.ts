// Cookie names and options. Kept free of server-only imports so proxy.ts can use them.

/** httpOnly cookie holding the app JWT from POST /auth/google (service default: 30 days). */
export const SESSION_COOKIE = "tr_session";
/** Short-lived 2FA challenge token between the Google step and the code step. */
export const CHALLENGE_COOKIE = "tr_2fa";
/** OAuth state + where to go after sign-in, set before the Google redirect. */
export const OAUTH_COOKIE = "tr_oauth";

const secure = process.env.NODE_ENV === "production";

/** Local demo: data comes from lib/mock instead of theround-service. Never enable in production. */
export const isMock = () => process.env.MOCK_MODE === "1" && process.env.NODE_ENV !== "production";

/** Session cookie value used by /auth/demo. */
export const DEMO_TOKEN = "demo";

export const sessionCookie = {
  httpOnly: true,
  secure,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export const shortCookie = (maxAge: number) => ({
  httpOnly: true,
  secure,
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

/** Only allow same-site relative paths as post-login destinations. */
export function safeNext(next: string | null | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/auth") ? next : "/";
}
