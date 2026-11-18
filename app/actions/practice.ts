"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { refresh } from "next/cache";
import { practice } from "@/lib/practice/repo";
import type { CategoryId, Duration, PracticeSession } from "@/lib/practice/types";

type Result = { ok: true; session: PracticeSession } | { ok: false; error: string };

async function run(fn: () => Promise<PracticeSession>): Promise<Result> {
  try {
    return { ok: true, session: await fn() };
  } catch (e) {
    unstable_rethrow(e);
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

const VALID = new Set<string>(["anatomy", "physiology", "pharmacology", "fon", "antenatal", "labour", "postnatal", "newborn", "family-planning", "medical", "emergency", "surgical", "mental-health", "surprise"]);
const topic = (v: string) => (VALID.has(v) ? (v as CategoryId | "surprise") : "surprise");

/** Home chips, composer and "New session" topic → new session → its page. */
export async function startSession(categoryId: string) {
  const session = await (await practice()).startSession({ categoryId: topic(categoryId) });
  redirect(`/s/${session.id}`);
}

export async function setDuration(roundId: string, duration: Duration) {
  return run(async () => (await practice()).setDuration(roundId, duration === 240 ? 240 : 90));
}

export async function differentQuestion(roundId: string) {
  return run(async () => (await practice()).differentQuestion(roundId));
}

/** Upload the recording (FormData: audio?, spokenSeconds). */
export async function completeRound(roundId: string, form: FormData) {
  return run(async () => {
    const spoken = Number(form.get("spokenSeconds")) || 1;
    const file = form.get("audio");
    const audio = file instanceof Blob && file.size > 0 ? { data: Buffer.from(await file.arrayBuffer()), mime: file.type || "audio/webm" } : null;
    return (await practice()).completeRound(roundId, spoken, audio);
  });
}

export async function reviewRound(roundId: string) {
  return run(async () => {
    const session = await (await practice()).reviewRound(roundId);
    refresh(); // sidebar meta (rounds · average)
    return session;
  });
}

export async function retake(sessionId: string) {
  return run(async () => (await practice()).retake(sessionId));
}

export async function nextQuestion(sessionId: string) {
  return run(async () => (await practice()).nextQuestion(sessionId));
}

export async function changeTopic(sessionId: string) {
  return run(async () => (await practice()).changeTopic(sessionId));
}

export async function pickTopic(sessionId: string, categoryId: string) {
  return run(async () => (await practice()).pickTopic(sessionId, topic(categoryId)));
}

export async function renameSession(sessionId: string, title: string) {
  return run(async () => {
    const s = await (await practice()).renameSession(sessionId, title);
    refresh();
    return s;
  });
}

export async function deleteSession(sessionId: string) {
  const deleted = await (await practice()).deleteSession(sessionId);
  const label = deleted ? `${deleted.title}${deleted.topic ? ` — ${deleted.topic} practice` : ""}` : "";
  redirect(deleted ? `/?deleted=${encodeURIComponent(deleted.id)}&label=${encodeURIComponent(label)}` : "/");
}

export async function restoreSession(sessionId: string) {
  await (await practice()).restoreSession(sessionId);
  redirect(`/s/${sessionId}`);
}

export async function audioUrl(roundId: string) {
  return (await practice()).audioUrl(roundId);
}
