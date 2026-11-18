// In-memory backend for MOCK_MODE=1 (local demo, no theround-service needed).
// Lives on globalThis so it survives hot reloads; resets when the dev server restarts.

import { QUESTIONS, CATEGORIES } from "../practice/catalog";
import { mockFeedback } from "../practice/feedback";
import type { CategoryId, PracticeRound, PracticeSession } from "../practice/types";
import type { User } from "../types";

interface Store {
  user: User;
  sessions: PracticeSession[];
  deleted: { session: PracticeSession; at: number }[];
  audio: Map<string, { data: Buffer; mime: string }>;
}

const g = globalThis as unknown as { __theroundMock?: Store };

export const uid = () => crypto.randomUUID();

const DEMO_USER: User = {
  id: "demo-user",
  email: "nkem@demo.gettheround.com",
  name: "Nkem",
  pictureUrl: null,
  avatarId: 4,
  stage: "student",
  course: "Midwifery",
  year: "Year 2",
  semester: "1st semester",
  goal: "build_confidence",
  defaultResponseSeconds: 90,
  soundCues: true,
  onboarded: true,
  twoFactorEnabled: false,
};

function daysAgo(n: number, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export function seededRound(categoryId: CategoryId, index: number, createdAt: string, spoken: number, duration: 90 | 240 = 90): PracticeRound {
  const bank = QUESTIONS[categoryId][index % QUESTIONS[categoryId].length];
  const id = uid();
  return {
    id,
    categoryId,
    topic: bank.topic,
    question: bank.question,
    prompt: `Let's practise ${CATEGORIES[categoryId].phrase}`,
    intro: `${CATEGORIES[categoryId].name} it is. Here's your question — answer it out loud.`,
    retake: false,
    durationSeconds: duration,
    status: "reviewed",
    spokenSeconds: spoken,
    hasAudio: false,
    feedback: mockFeedback(id, bank, spoken, duration),
    createdAt,
  };
}

function seedSession(categoryId: CategoryId, createdAt: string, rounds: PracticeRound[]): PracticeSession {
  return { id: uid(), title: CATEGORIES[categoryId].name, categoryId, createdAt, updatedAt: createdAt, rounds, pickingTopic: false };
}

function seed(): Store {
  return {
    user: { ...DEMO_USER },
    sessions: [
      seedSession("labour", daysAgo(1), [seededRound("labour", 1, daysAgo(1), 150, 240), seededRound("labour", 2, daysAgo(1), 70)]),
      seedSession("newborn", daysAgo(3), [seededRound("newborn", 0, daysAgo(3), 81)]),
      seedSession("family-planning", daysAgo(4), [seededRound("family-planning", 0, daysAgo(4), 40), seededRound("family-planning", 0, daysAgo(4), 84)]),
    ],
    deleted: [],
    audio: new Map(),
  };
}

export function store(): Store {
  if (!g.__theroundMock) g.__theroundMock = seed();
  return g.__theroundMock;
}

/** /auth/demo: fresh demo data; `onboarding` starts from a blank, un-onboarded user. */
export function resetStore(opts: { onboarding?: boolean } = {}) {
  g.__theroundMock = seed();
  if (opts.onboarding) {
    g.__theroundMock.user = { ...DEMO_USER, name: "Nkem", stage: null, course: null, year: null, semester: null, avatarId: null, goal: null, onboarded: false };
    g.__theroundMock.sessions = [];
  }
}
