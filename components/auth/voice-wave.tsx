/**
 * Speech-like waveform for the practice prompt card: thin rounded bars grouped
 * into word bursts with short pauses, the "spoken" part in lime and the rest
 * muted. Heights are deterministic (no Math.random) so server and client match.
 * The idle motion is CSS-only and stops under prefers-reduced-motion.
 */

// Syllable counts per "word"; 0 = a pause between phrases.
const WORDS = [2, 3, 1, 2, 0, 4, 2, 3, 0, 1, 3, 2, 0, 2, 3, 2];
const BARS_PER_SYLLABLE = 3;
const PAUSE_BARS = 2;
const MAX = 26; // px, tallest bar
const MIN = 3; // px, silence

/** Small deterministic noise in [0, 1). */
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function buildBars() {
  const bars: number[] = [];
  let i = 0;
  WORDS.forEach((syllables, w) => {
    if (syllables === 0) {
      for (let k = 0; k < PAUSE_BARS; k++) bars.push(MIN);
      return;
    }
    const n = syllables * BARS_PER_SYLLABLE;
    const stress = 0.65 + 0.35 * noise(w + 100); // some words louder
    for (let k = 0; k < n; k++) {
      const t = k / (n - 1 || 1);
      const word = 0.25 + 0.75 * Math.sin(Math.PI * t) ** 0.45; // rise and fall across the word
      const syllable = 0.5 + 0.5 * Math.abs(Math.sin((Math.PI * k) / BARS_PER_SYLLABLE + 0.6)); // syllable pulses
      const jitter = 0.75 + 0.25 * noise(i++);
      bars.push(Math.max(MIN, Math.round(MIN + (MAX - MIN) * word * syllable * stress * jitter)));
    }
    bars.push(MIN + 2); // short breath between words
  });
  return bars;
}

const BARS = buildBars();
const PLAYED = 0.42; // share of the clip already "spoken"

export function VoiceWave({ className }: { className?: string }) {
  const playedUntil = Math.round(BARS.length * PLAYED);
  return (
    <div aria-hidden className={`flex h-[28px] items-center justify-between ${className ?? ""}`}>
      {BARS.map((h, i) => {
        const played = i < playedUntil;
        return (
          <span
            key={i}
            className={`voice-bar w-[3px] shrink-0 rounded-full ${played ? "bg-lime" : "bg-sprout/45"}`}
            style={{ height: h, animationDelay: `${(i % 9) * -0.13 - noise(i + 7) * 0.4}s` }}
          />
        );
      })}
    </div>
  );
}
