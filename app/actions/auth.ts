"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, authRequest } from "@/lib/api";
import { CHALLENGE_COOKIE, SESSION_COOKIE, safeNext, sessionCookie } from "@/lib/session";

export type VerifyState = { error?: string };

/** Second sign-in step for users with two-factor on: POST /auth/2fa. */
export async function verifyTwoFactor(_prev: VerifyState, form: FormData): Promise<VerifyState> {
  const jar = await cookies();
  const challengeToken = jar.get(CHALLENGE_COOKIE)?.value;
  if (!challengeToken) redirect("/login?error=state");

  const code = String(form.get("code") ?? "").replace(/\s+/g, "");
  if (!code) return { error: "Enter the 6-digit code from your authenticator app." };

  let login;
  try {
    login = await authRequest("/auth/2fa", { challengeToken, code });
  } catch (e) {
    // 401 (wrong code / challenge expired) and 429 (locked out) carry user-ready messages.
    if (e instanceof ApiError && (e.status === 401 || e.status === 429)) return { error: e.message };
    if (e instanceof ApiError && e.status === 403) redirect("/login?error=suspended");
    return { error: "We can't reach the round right now. Please try again." };
  }
  if (login.twoFactorRequired) return { error: "That code didn't work. Try again." };

  jar.delete(CHALLENGE_COOKIE);
  jar.set(SESSION_COOKIE, login.accessToken, sessionCookie);
  redirect(login.user.onboarded ? safeNext(String(form.get("next") ?? "")) : "/onboarding");
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(CHALLENGE_COOKIE);
  redirect("/login");
}
