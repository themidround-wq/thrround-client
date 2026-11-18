"use server";

import { refresh } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { isMock } from "@/lib/session";
import type { User } from "@/lib/types";

export type ProfilePatch = Partial<Pick<User, "name" | "stage" | "course" | "year" | "semester" | "avatarId" | "goal" | "defaultResponseSeconds" | "pictureUrl">>;

/** PATCH /me from the profile page; refreshes the sidebar footer too. */
export async function updateProfile(patch: ProfilePatch): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    // theround-service has no photo upload yet; only the demo store keeps pictureUrl.
    const body = { ...patch };
    if (!isMock()) delete body.pictureUrl;
    const user = await apiFetch<User>("/me", { method: "PATCH", body });
    refresh();
    return { ok: true, user };
  } catch (e) {
    unstable_rethrow(e);
    return { ok: false, error: e instanceof ApiError ? e.message : "Couldn't save that. Please try again." };
  }
}
