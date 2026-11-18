// theround-service implementation of the practice repository: /practice/* endpoints
// (src/practice in the service). Same shapes as lib/practice/types.ts.

import { cookies } from "next/headers";
import { ApiError, apiFetch, apiUrl } from "../api";
import { SESSION_COOKIE } from "../session";
import type { PracticeRepo } from "./repo";
import type { PracticeSession, PracticeStats, SessionSummary } from "./types";

const post = <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "POST", body });

export const apiRepo: PracticeRepo = {
  listSessions: () => apiFetch<SessionSummary[]>("/practice/sessions"),
  async getSession(id) {
    try {
      return await apiFetch<PracticeSession>(`/practice/sessions/${encodeURIComponent(id)}`);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 404 || e.status === 400)) return null;
      throw e;
    }
  },
  startSession: (input) => post("/practice/sessions", input),
  setDuration: (roundId, durationSeconds) => apiFetch(`/practice/rounds/${roundId}`, { method: "PATCH", body: { durationSeconds } }),
  differentQuestion: (roundId) => post(`/practice/rounds/${roundId}/different`),
  async completeRound(roundId, spokenSeconds, audio) {
    // Multipart upload goes direct so the body isn't JSON-encoded.
    const form = new FormData();
    form.set("spokenSeconds", String(Math.round(spokenSeconds)));
    if (audio) form.set("audio", new Blob([new Uint8Array(audio.data)], { type: audio.mime }), "answer.webm");
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    const res = await fetch(apiUrl(`/practice/rounds/${roundId}/complete`), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      cache: "no-store",
    });
    if (!res.ok) throw new ApiError(res.status, `Upload failed (${res.status})`);
    return (await res.json()) as PracticeSession;
  },
  // Transcription + AI marking can take a while (open models especially).
  reviewRound: (roundId) => apiFetch(`/practice/rounds/${roundId}/review`, { method: "POST", timeoutMs: 240_000 }),
  retake: (id) => post(`/practice/sessions/${id}/retake`),
  nextQuestion: (id) => post(`/practice/sessions/${id}/next`),
  changeTopic: (id) => post(`/practice/sessions/${id}/change-topic`),
  pickTopic: (id, categoryId) => post(`/practice/sessions/${id}/topic`, { categoryId }),
  renameSession: (id, title) => apiFetch(`/practice/sessions/${id}`, { method: "PATCH", body: { title } }),
  deleteSession: (id) => apiFetch(`/practice/sessions/${id}`, { method: "DELETE" }),
  async restoreSession(id) {
    await post(`/practice/sessions/${id}/restore`);
    return true;
  },
  async audioUrl(roundId) {
    const r = await apiFetch<{ url: string }>(`/practice/rounds/${roundId}/audio`).catch(() => null);
    return r?.url ?? null;
  },
  stats: () => apiFetch<PracticeStats>("/practice/stats"),
};
