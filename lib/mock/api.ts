// MOCK_MODE stand-in for the user endpoints apiFetch calls (/me today).

import { ApiError } from "../api";
import { mockRepo } from "../practice/mock-repo";
import type { User } from "../types";
import { store } from "./store";

const EDITABLE = ["name", "stage", "course", "year", "semester", "avatarId", "goal", "defaultResponseSeconds", "soundCues", "pictureUrl"] as const;

export function mockApi<T>(path: string, opts: { method?: string; body?: unknown }): T {
  const method = opts.method ?? "GET";
  const st = store();
  if (path === "/me" && method === "GET") {
    const s = mockRepo.stats();
    return {
      user: st.user,
      stats: { totalRounds: s.rounds, roundsThisWeek: s.rounds, speakingSeconds: s.speakingMinutes * 60, mostPractised: null, currentStreakDays: s.streakDays },
    } as T;
  }
  if (path === "/me" && method === "PATCH") {
    const body = (opts.body ?? {}) as Partial<User>;
    for (const k of EDITABLE) if (k in body) (st.user as unknown as Record<string, unknown>)[k] = body[k];
    const u = st.user;
    u.onboarded = Boolean(u.name && u.stage && u.avatarId && u.goal);
    return u as T;
  }
  throw new ApiError(404, `Mock API has no ${method} ${path}`);
}
