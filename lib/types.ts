// Response shapes from theround-service (src/common/api.response.ts).
// Keep in sync with the service; Swagger at <API>/api/docs.

export type Stage = "student" | "qualified";
export type Goal = "build_confidence" | "prepare_for_exams";
export type ResponseSeconds = 90 | 240; // 90 = Quick, 240 = Case
export type RoundStatus = "spun" | "in_progress" | "completed" | "saved";
export type Reflection = "clear" | "a_little_unsure" | "lost_my_structure" | "want_another_go";

export interface User {
  id: string;
  email: string;
  name: string | null;
  pictureUrl: string | null;
  avatarId: number | null; // 1-8
  stage: Stage | null;
  course: string | null;
  year: string | null;
  semester: string | null;
  goal: Goal | null;
  defaultResponseSeconds: ResponseSeconds;
  soundCues: boolean;
  onboarded: boolean;
  twoFactorEnabled: boolean;
}

export interface Stats {
  totalRounds: number;
  roundsThisWeek: number;
  speakingSeconds: number;
  mostPractised: { category: string; rounds: number } | null;
  currentStreakDays: number;
}

export interface Me {
  user: User;
  stats: Stats;
}

/** POST /auth/google and POST /auth/2fa. */
export type LoginResponse =
  | { twoFactorRequired: true; challengeToken: string }
  | { twoFactorRequired: false; accessToken: string; isNewUser: boolean; user: User };

export interface IdName {
  id: string;
  name: string;
}

export interface Catalog {
  categories: IdName[]; // wheel segments, in order
  topicCount: number;
}

export interface Round {
  id: string;
  status: RoundStatus;
  category: IdName;
  topic: IdName;
  question: { id: string; text: string };
  durationSeconds: ResponseSeconds;
  responseType: "quick" | "case";
  spokenSeconds: number | null;
  hasAudio: boolean;
  reflection: Reflection | null;
  note: string | null;
  bookmarked: boolean;
  createdAt: string;
  savedAt: string | null;
}

export interface RoundList {
  items: Round[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AudioUrl {
  url: string; // signed, use as <audio src>
  expiresInSeconds: number;
}

export interface TwoFactorStatus {
  enabled: boolean;
  enabledAt: string | null;
  recoveryCodesLeft: number;
}
