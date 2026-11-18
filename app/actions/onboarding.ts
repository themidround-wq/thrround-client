"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import type { Goal, Me, Stage } from "@/lib/types";

export type Basics = {
  name: string;
  stage: Stage;
  /** Students: course. Qualified: profession (stored in the same `course` field). */
  course: string;
  year?: string;
  semester?: string;
};

// apiFetch redirects on 401/403; let those through instead of turning them into a form error.
const fail = (e: unknown) => {
  unstable_rethrow(e);
  return { ok: false as const, error: e instanceof ApiError ? e.message : "Something went wrong. Please try again." };
};

/** Step 1 → PATCH /me with name, stage and course details. */
export async function saveBasics(input: Basics) {
  const name = input.name.trim();
  if (!name) return { ok: false as const, error: "Tell us what to call you." };
  try {
    await apiFetch<Me["user"]>("/me", {
      method: "PATCH",
      body: {
        name,
        stage: input.stage,
        course: input.course,
        ...(input.stage === "student" ? { year: input.year, semester: input.semester } : {}),
      },
    });
    return { ok: true as const };
  } catch (e) {
    return fail(e);
  }
}

/** Step 2 → PATCH /me with avatar and goal; the service then marks the user onboarded. */
export async function finishOnboarding(input: { avatarId: number; goal: Goal }) {
  try {
    await apiFetch("/me", { method: "PATCH", body: input });
  } catch (e) {
    return fail(e);
  }
  redirect("/");
}
