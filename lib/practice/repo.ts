// Practice data access for Server Components and Server Actions.
// MOCK_MODE → in-memory demo store; otherwise theround-service (/practice/*).

import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { isMock, SESSION_COOKIE } from "../session";
import { apiRepo } from "./api-repo";
import { mockRepo } from "./mock-repo";
import type { CategoryId, Duration, PracticeSession, PracticeStats, SessionSummary } from "./types";

export interface PracticeRepo {
  listSessions(): Promise<SessionSummary[]>;
  getSession(id: string): Promise<PracticeSession | null>;
  startSession(input: { categoryId: CategoryId | "surprise" }): Promise<PracticeSession>;
  setDuration(roundId: string, duration: Duration): Promise<PracticeSession>;
  differentQuestion(roundId: string): Promise<PracticeSession>;
  completeRound(roundId: string, spokenSeconds: number, audio: { data: Buffer; mime: string } | null): Promise<PracticeSession>;
  reviewRound(roundId: string): Promise<PracticeSession>;
  retake(sessionId: string): Promise<PracticeSession>;
  nextQuestion(sessionId: string): Promise<PracticeSession>;
  changeTopic(sessionId: string): Promise<PracticeSession>;
  pickTopic(sessionId: string, categoryId: CategoryId | "surprise"): Promise<PracticeSession>;
  renameSession(id: string, title: string): Promise<PracticeSession>;
  deleteSession(id: string): Promise<{ id: string; title: string; topic: string } | null>;
  restoreSession(id: string): Promise<boolean>;
  audioUrl(roundId: string): Promise<string | null>;
  stats(): Promise<PracticeStats>;
}

const asyncMock: PracticeRepo = {
  listSessions: async () => mockRepo.listSessions(),
  getSession: async (id) => mockRepo.getSession(id),
  startSession: async (i) => mockRepo.startSession(i),
  setDuration: async (r, d) => mockRepo.setDuration(r, d),
  differentQuestion: async (r) => mockRepo.differentQuestion(r),
  completeRound: async (r, s, a) => mockRepo.completeRound(r, s, a),
  reviewRound: async (r) => mockRepo.reviewRound(r),
  retake: async (s) => mockRepo.retake(s),
  nextQuestion: async (s) => mockRepo.nextQuestion(s),
  changeTopic: async (s) => mockRepo.changeTopic(s),
  pickTopic: async (s, c) => mockRepo.pickTopic(s, c),
  renameSession: async (id, t) => mockRepo.renameSession(id, t),
  deleteSession: async (id) => mockRepo.deleteSession(id),
  restoreSession: async (id) => mockRepo.restoreSession(id),
  audioUrl: async (r) => (mockRepo.audio(r) ? `/api/mock-audio/${r}` : null),
  stats: async () => mockRepo.stats(),
};

/** The signed-in user's practice data. Reads the session cookie, so call it inside Suspense. */
export async function practice(): Promise<PracticeRepo> {
  if (!(await cookies()).get(SESSION_COOKIE)?.value) redirect("/login");
  await connection();
  return isMock() ? asyncMock : apiRepo;
}
