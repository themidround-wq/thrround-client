const TZ = "Africa/Lagos";

const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });

/** Sidebar date: "10:00 AM" today, "Yesterday", weekday this week, else "12 Nov". */
export function historyLabel(iso: string, now = new Date()) {
  const d = new Date(iso);
  const days = Math.round((new Date(dayKey(now)).getTime() - new Date(dayKey(d)).getTime()) / 86_400_000);
  if (days <= 0) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ });
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString("en-GB", { weekday: "short", timeZone: TZ });
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: TZ });
}

export function historyGroup(iso: string, now = new Date()): "Today" | "This week" | "Earlier" {
  const days = Math.round((new Date(dayKey(now)).getTime() - new Date(dayKey(new Date(iso))).getTime()) / 86_400_000);
  return days <= 0 ? "Today" : days < 7 ? "This week" : "Earlier";
}

export function greeting(now = new Date()) {
  const h = Number(now.toLocaleTimeString("en-GB", { hour: "2-digit", hour12: false, timeZone: TZ }));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export const clock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.round(s) % 60).padStart(2, "0")}`;

export const lengthLabel = (s: number) => (s === 240 ? "4 min" : "1½ min");

/** "Student Midwife", "Registered Nurse"… for the sidebar footer. */
export function roleLabel(user: { stage: string | null; course: string | null }) {
  if (user.stage === "qualified") return user.course ?? "Qualified";
  const course = user.course && /nurs/i.test(user.course) && !/midwi/i.test(user.course) ? "Nurse" : "Midwife";
  return `Student ${course}`;
}
