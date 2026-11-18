"use client";

import { useEffect, useRef, useState } from "react";
import { audioUrl } from "@/app/actions/practice";
import { PauseIcon, PlayIcon } from "@/components/app-icons";
import { clock } from "@/lib/practice/format";

const noise = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Static speech-shaped bars for a recording (seeded by round id). */
function bars(seedText: string, n: number) {
  const seed = [...seedText].reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: n }, (_, i) => {
    const word = Math.abs(Math.sin(i / 2.6 + seed)) ** 0.7;
    return 0.22 + 0.78 * word * (0.55 + 0.45 * noise(i, seed));
  });
}

/** Grey pill player from designs 06/07: play button, waveform, duration. */
export function AudioPlayer({ roundId, hasAudio, seconds }: { roundId: string; hasAudio: boolean; seconds: number }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const shape = bars(roundId, 36);

  useEffect(() => () => audio.current?.pause(), []);

  async function toggle() {
    if (!hasAudio) return;
    if (!audio.current) {
      setLoading(true);
      const url = await audioUrl(roundId);
      setLoading(false);
      if (!url) return;
      const a = new Audio(url);
      a.ontimeupdate = () => setProgress(a.duration && isFinite(a.duration) ? a.currentTime / a.duration : a.currentTime / seconds);
      a.onended = () => {
        setPlaying(false);
        setProgress(0);
      };
      audio.current = a;
    }
    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      await audio.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  return (
    <div className="flex h-[52px] items-center gap-[14px] rounded-full bg-[#f4f2f1] pl-[8px] pr-[26px] lg:h-[56px]">
      <button
        type="button"
        onClick={toggle}
        disabled={!hasAudio || loading}
        aria-label={playing ? "Pause" : hasAudio ? "Play your answer" : "No recording saved"}
        title={hasAudio ? undefined : "No recording saved for this round"}
        className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-ink text-lime transition-transform enabled:hover:scale-105 disabled:opacity-80"
      >
        {playing ? <PauseIcon className="h-[14px] w-[14px]" /> : <PlayIcon className="ml-[2px] h-[15px] w-[15px]" />}
      </button>
      <div aria-hidden className="flex h-[26px] flex-1 items-center gap-[3px] overflow-hidden">
        {shape.map((h, i) => (
          <span
            key={i}
            className="w-[3px] shrink-0 rounded-full transition-colors"
            style={{ height: `${Math.round(h * 100)}%`, background: i / shape.length < progress ? "#14271a" : "#abb1ac" }}
          />
        ))}
      </div>
      <span className="num shrink-0 text-[14px] font-medium text-text">{clock(seconds)}</span>
    </div>
  );
}
