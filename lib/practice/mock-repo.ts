// MOCK_MODE implementation of the practice repository (see repo.ts).

import { CATEGORIES, QUESTIONS, topicsFor } from "./catalog";
import { mockFeedback } from "./feedback";
import type { CategoryId, Duration, PracticeRound, PracticeSession, PracticeStats, SessionSummary } from "./types";
import { store, uid } from "../mock/store";

const now = () => new Date().toISOString();

function findSession(id: string) {
  const s = store().sessions.find((x) => x.id === id);
  if (!s) throw new Error("Session not found");
  return s;
}

function findRound(roundId: string): { session: PracticeSession; round: PracticeRound } {
  for (const session of store().sessions) {
    const round = session.rounds.find((r) => r.id === roundId);
    if (round) return { session, round };
  }
  throw new Error("Round not found");
}

/** Least-recently-asked question in a category, skipping `avoid`. */
function pickQuestion(categoryId: CategoryId, avoid?: string) {
  const bank = QUESTIONS[categoryId];
  const asked = store().sessions.flatMap((s) => s.rounds).filter((r) => r.categoryId === categoryId).map((r) => r.question);
  const options = bank.filter((b) => b.question !== avoid);
  const pool = options.length ? options : bank;
  return [...pool].sort((a, b) => asked.filter((x) => x === a.question).length - asked.filter((x) => x === b.question).length)[0];
}

function newRound(categoryId: CategoryId, prompt: string, intro: string, opts: { question?: string; retake?: boolean; duration?: Duration } = {}): PracticeRound {
  const bank = opts.question ? QUESTIONS[categoryId].find((b) => b.question === opts.question)! : pickQuestion(categoryId);
  return {
    id: uid(),
    categoryId,
    topic: bank.topic,
    question: bank.question,
    prompt,
    intro,
    retake: Boolean(opts.retake),
    durationSeconds: opts.duration ?? (store().user.defaultResponseSeconds === 240 ? 240 : 90),
    status: "ready",
    spokenSeconds: null,
    hasAudio: false,
    feedback: null,
    createdAt: now(),
  };
}

const touch = (s: PracticeSession) => {
  s.updatedAt = now();
  return structuredClone(s);
};

export function resolveCategory(id: CategoryId | "surprise"): CategoryId {
  if (id !== "surprise") return id;
  const options = topicsFor(store().user.course);
  // Weighted toward the least-practised topics, like the service's spin.
  const counts = new Map(options.map((c) => [c, store().sessions.flatMap((s) => s.rounds).filter((r) => r.categoryId === c).length]));
  const min = Math.min(...counts.values());
  const least = options.filter((c) => counts.get(c) === min);
  return least[Math.floor(Math.random() * least.length)];
}

export const mockRepo = {
  listSessions(): SessionSummary[] {
    return store()
      .sessions.slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(({ id, title, categoryId, createdAt }) => ({ id, title, categoryId, createdAt }));
  },

  getSession(id: string): PracticeSession | null {
    const s = store().sessions.find((x) => x.id === id);
    return s ? structuredClone(s) : null;
  },

  startSession(input: { categoryId: CategoryId | "surprise" }): PracticeSession {
    const categoryId = resolveCategory(input.categoryId);
    const cat = CATEGORIES[categoryId];
    const surprise = input.categoryId === "surprise";
    const round = newRound(
      categoryId,
      surprise ? "Surprise me" : `Let's practise ${cat.phrase}`,
      surprise ? `Let's go with ${cat.name}. Here's your question — answer it out loud.` : `${cat.name} it is. Here's your question — answer it out loud.`,
    );
    const session: PracticeSession = { id: uid(), title: cat.name, categoryId, createdAt: now(), updatedAt: now(), rounds: [round], pickingTopic: false };
    store().sessions.unshift(session);
    return structuredClone(session);
  },

  setDuration(roundId: string, duration: Duration) {
    const { session, round } = findRound(roundId);
    if (round.status === "ready") round.durationSeconds = duration;
    return touch(session);
  },

  differentQuestion(roundId: string) {
    const { session, round } = findRound(roundId);
    if (round.status !== "ready") return touch(session);
    const bank = pickQuestion(round.categoryId, round.question);
    round.topic = bank.topic;
    round.question = bank.question;
    round.retake = false;
    return touch(session);
  },

  completeRound(roundId: string, spokenSeconds: number, audio: { data: Buffer; mime: string } | null) {
    const { session, round } = findRound(roundId);
    round.status = "recorded";
    round.spokenSeconds = Math.max(1, Math.min(round.durationSeconds, Math.round(spokenSeconds)));
    if (audio) {
      store().audio.set(round.id, audio);
      round.hasAudio = true;
    }
    return touch(session);
  },

  reviewRound(roundId: string) {
    const { session, round } = findRound(roundId);
    if (round.status === "recorded") {
      const bank = QUESTIONS[round.categoryId].find((b) => b.question === round.question) ?? QUESTIONS[round.categoryId][0];
      round.feedback = mockFeedback(round.id, bank, round.spokenSeconds ?? 1, round.durationSeconds);
      round.status = "reviewed";
    }
    return touch(session);
  },

  retake(sessionId: string) {
    const s = findSession(sessionId);
    const last = s.rounds.at(-1)!;
    s.pickingTopic = false;
    s.rounds.push(newRound(last.categoryId, "Let me try that again", "Same question, a fresh start. Put that feedback into practice.", { question: last.question, retake: true, duration: last.durationSeconds }));
    return touch(s);
  },

  nextQuestion(sessionId: string) {
    const s = findSession(sessionId);
    const last = s.rounds.at(-1)!;
    s.pickingTopic = false;
    s.rounds.push(newRound(last.categoryId, "Next question, please", "Here's another one — answer it out loud.", { duration: last.durationSeconds }));
    return touch(s);
  },

  changeTopic(sessionId: string) {
    const s = findSession(sessionId);
    s.pickingTopic = true;
    return touch(s);
  },

  pickTopic(sessionId: string, input: CategoryId | "surprise") {
    const s = findSession(sessionId);
    const categoryId = resolveCategory(input);
    const cat = CATEGORIES[categoryId];
    s.pickingTopic = false;
    s.rounds.push(newRound(categoryId, input === "surprise" ? "Surprise me" : `Let's practise ${cat.phrase}`, `${cat.name} it is. Here's your question — answer it out loud.`));
    return touch(s);
  },

  renameSession(id: string, title: string) {
    const s = findSession(id);
    s.title = title.trim().slice(0, 80) || s.title;
    return touch(s);
  },

  deleteSession(id: string) {
    const st = store();
    const i = st.sessions.findIndex((x) => x.id === id);
    if (i < 0) return null;
    const [session] = st.sessions.splice(i, 1);
    st.deleted.push({ session, at: Date.now() });
    return { id: session.id, title: session.title, topic: session.rounds[0]?.topic ?? "" };
  },

  restoreSession(id: string) {
    const st = store();
    const i = st.deleted.findIndex((d) => d.session.id === id);
    if (i < 0) return false;
    const [{ session }] = st.deleted.splice(i, 1);
    st.sessions.push(session);
    return true;
  },

  audio(roundId: string) {
    return store().audio.get(roundId) ?? null;
  },

  stats(): PracticeStats {
    const reviewed = store().sessions.flatMap((s) => s.rounds).filter((r) => r.status === "reviewed" && r.feedback);
    const scores = reviewed.map((r) => r.feedback!.score);
    const days = new Set(reviewed.map((r) => r.createdAt.slice(0, 10)));
    let streak = 0;
    const d = new Date();
    if (!days.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (days.has(d.toISOString().slice(0, 10))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return {
      rounds: reviewed.length,
      averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
      bestScore: scores.length ? Math.max(...scores) : null,
      speakingMinutes: Math.round(reviewed.reduce((a, r) => a + (r.spokenSeconds ?? 0), 0) / 60),
      streakDays: streak,
    };
  },
};
