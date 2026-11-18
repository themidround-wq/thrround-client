import type { BankQuestion } from "./catalog";
import type { Feedback } from "./types";

const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.round(s) % 60).padStart(2, "0")}`;

/** Deterministic 0..1 from a string, so a round always gets the same mock feedback. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

/**
 * Mock examiner feedback. Score follows how much of the time was used (sweet
 * spot 60–95%) with a little per-round variation. Real scoring would come from
 * a transcription + rubric service.
 */
export function mockFeedback(roundId: string, bank: BankQuestion, spokenSeconds: number, durationSeconds: number): Feedback {
  const ratio = spokenSeconds / durationSeconds;
  const use = ratio < 0.25 ? 0.45 : ratio < 0.6 ? 0.72 : ratio <= 0.95 ? 0.9 : 0.8;
  const r = hash(roundId);
  const score = Math.max(38, Math.min(96, Math.round(52 + use * 34 + r * 8)));
  const missed = score >= 88 ? -1 : bank.examiner.length - 1;
  const verdict = score >= 80 ? "Strong answer" : score >= 65 ? "Good start" : "Keep going";
  const lead =
    score >= 80
      ? "Strong answer. Clear and well structured, with a couple of small things to tighten."
      : score >= 65
        ? "A good start. The core is there; a clearer structure will lift it."
        : "You've made a start. Let's build more structure and detail into the next go.";
  const metric = (label: string, i: number) => ({ label, score: Math.max(35, Math.min(98, score + Math.round((hash(roundId + i) - 0.5) * 6))) });
  return {
    score,
    verdict,
    summary: `${lead} You spoke for ${clock(spokenSeconds)} of your ${clock(durationSeconds)}${ratio >= 0.6 ? ", using your time well." : "."}`,
    metrics: [metric("Structure", 1), metric("Clarity", 2), metric("Clinical accuracy", 3), metric("Confidence", 4)],
    worked: [
      "You opened with a clear structure, so it was easy to follow.",
      "You put safety first — exactly what examiners listen for.",
      ratio >= 0.6 ? "Your pace stayed calm and steady." : "You stayed focused on the question.",
    ],
    workOn: bank.workOn,
    examiner: bank.examiner.map((label, i) => ({ label, covered: i !== missed })),
  };
}
