// Practice domain used by the app UI (sessions → rounds → feedback).
// theround-service has rounds but no sessions or scored feedback yet, so in
// MOCK_MODE these live in lib/mock/store.ts. See CLAUDE.md → Mock mode.

export type CategoryId =
  | "anatomy"
  | "physiology"
  | "pharmacology"
  | "fon"
  | "antenatal"
  | "labour"
  | "postnatal"
  | "newborn"
  | "family-planning"
  | "medical"
  | "emergency"
  | "surgical"
  | "mental-health";

export type Duration = 90 | 240;

export interface ExaminerPoint {
  label: string;
  covered: boolean;
}

export interface Feedback {
  score: number; // 0-100
  verdict: string; // "Strong answer"
  summary: string;
  metrics: { label: string; score: number }[];
  worked: string[];
  workOn: { point: string; trySaying: string }[];
  examiner: ExaminerPoint[];
}

export type RoundStatus = "ready" | "recorded" | "reviewed";

export interface PracticeRound {
  id: string;
  categoryId: CategoryId;
  topic: string;
  question: string;
  /** What the user "said" to start this round, shown as their chat bubble. */
  prompt: string;
  /** Assistant line above the question card. */
  intro: string;
  retake: boolean;
  durationSeconds: Duration;
  status: RoundStatus;
  spokenSeconds: number | null;
  hasAudio: boolean;
  feedback: Feedback | null;
  /** Speech-to-text of the answer, when AI marking ran. */
  transcript?: string | null;
  feedbackSource?: "ai" | "placeholder" | null;
  createdAt: string;
}

export interface PracticeSession {
  id: string;
  title: string;
  categoryId: CategoryId;
  createdAt: string;
  updatedAt: string;
  rounds: PracticeRound[];
  /** Set after "Change topic": show the topic picker at the end of the thread. */
  pickingTopic: boolean;
}

export interface SessionSummary {
  id: string;
  title: string;
  categoryId: CategoryId;
  createdAt: string;
}

export interface PracticeStats {
  rounds: number;
  averageScore: number | null;
  bestScore: number | null;
  speakingMinutes: number;
  streakDays: number;
}
