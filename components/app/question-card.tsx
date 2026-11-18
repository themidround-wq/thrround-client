"use client";

import { useState, useTransition } from "react";
import { completeRound, differentQuestion, setDuration } from "@/app/actions/practice";
import { CategoryIcon, MicIcon, ShuffleIcon } from "@/components/app-icons";
import { cx } from "@/components/ui";
import { CATEGORIES } from "@/lib/practice/catalog";
import { clock, lengthLabel } from "@/lib/practice/format";
import type { Duration, PracticeRound, PracticeSession } from "@/lib/practice/types";
import { AudioPlayer } from "./audio-player";
import { useRecorder } from "./use-recorder";

const cardBg = (tint: string) => `linear-gradient(180deg, color-mix(in srgb, ${tint} 72%, white) 0%, #ffffff 58%)`;

function CardHeader({ round }: { round: PracticeRound }) {
  const c = CATEGORIES[round.categoryId];
  return (
    <div className="flex flex-wrap items-center gap-x-[12px] gap-y-1 text-[13px]">
      <span className="flex items-center gap-[7px] font-medium" style={{ color: c.ink }}>
        <CategoryIcon id={round.categoryId} className="h-[15px] w-[15px]" />
        {c.name}
      </span>
      <span className="text-text-2">{round.topic}</span>
      {round.retake && <span className="rounded-full bg-lime px-[8px] py-[3px] text-[11px] font-bold leading-none text-ink">Retake</span>}
    </div>
  );
}

/** Recorded round: compact question + playback (designs 06/07). */
export function AnsweredCard({ round }: { round: PracticeRound }) {
  const c = CATEGORIES[round.categoryId];
  return (
    <div className="rounded-[28px] border border-[#ebe7e5] px-[16px] pb-[16px] pt-[22px] lg:px-[22px] lg:pb-[20px] lg:pt-[25px]" style={{ background: cardBg(c.tint) }}>
      <div className="px-[6px] lg:px-[2px]">
        <CardHeader round={round} />
        <p className="mt-[12px] text-[18px] font-medium leading-[24px] tracking-[-0.02em] text-text lg:mt-[10px] lg:text-[19px]">{round.question}</p>
      </div>
      <div className="mt-[16px] lg:mt-[17px]">
        <AudioPlayer roundId={round.id} hasAudio={round.hasAudio} seconds={round.spokenSeconds ?? 0} />
      </div>
    </div>
  );
}

/** Live question: answer length, start/stop recording, different question (designs 03/04/05). */
export function QuestionCard({ round, onSession }: { round: PracticeRound; onSession: (s: PracticeSession) => void }) {
  const c = CATEGORIES[round.categoryId];
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const recorder = useRecorder(round.durationSeconds, async ({ blob, seconds }) => {
    setUploading(true);
    const form = new FormData();
    form.set("spokenSeconds", String(Math.round(seconds)));
    if (blob) form.set("audio", blob, "answer.webm");
    const res = await completeRound(round.id, form);
    setUploading(false);
    if (res.ok) onSession(res.session);
    else setError(res.error);
  });

  const apply = (p: Promise<{ ok: true; session: PracticeSession } | { ok: false; error: string }>) =>
    start(async () => {
      const res = await p;
      if (res.ok) onSession(res.session);
      else setError(res.error);
    });

  const recording = recorder.state === "recording";
  const progress = Math.min(1, recorder.elapsed / round.durationSeconds);

  return (
    <div className="rounded-[28px] border border-[#ebe7e5] px-[18px] pb-[18px] pt-[22px] lg:px-[24px] lg:pb-[24px] lg:pt-[25px]" style={{ background: cardBg(c.tint) }}>
      <div className="lg:px-[1px]">
        <CardHeader round={round} />
        <p className="mt-[14px] max-w-[440px] text-[22px] font-medium leading-[27px] tracking-[-0.03em] text-text lg:mt-[16px] lg:text-[25px] lg:leading-[31px]">{round.question}</p>
      </div>

      {recording || uploading ? (
        <>
          <button
            type="button"
            onClick={recorder.stop}
            disabled={uploading}
            className="mt-[22px] flex h-[66px] w-full items-center gap-[14px] rounded-full border border-[#d6efb0] bg-[#e8f7cf] pl-[10px] pr-[22px] text-left lg:mt-[23px] lg:h-[72px] lg:pl-[12px]"
            aria-label="Stop recording"
          >
            <span className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-ink">
              <svg viewBox="0 0 50 50" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="25" cy="25" r="22.5" fill="none" stroke="#caff79" strokeOpacity="0.25" strokeWidth="2.5" />
                <circle cx="25" cy="25" r="22.5" fill="none" stroke="#caff79" strokeWidth="2.5" strokeDasharray={`${progress * 141.4} 141.4`} strokeLinecap="round" />
              </svg>
              <span className="h-[14px] w-[14px] rounded-[3px] bg-lime" />
            </span>
            <span aria-hidden className="flex h-[30px] min-w-0 flex-1 items-center justify-between gap-[3px] overflow-hidden">
              {recorder.levels.map((l, i) => (
                <span key={i} className="w-[3px] shrink-0 rounded-full bg-[#071a0f] transition-[height] duration-100" style={{ height: `${Math.max(4, Math.round(l * 30))}px` }} />
              ))}
            </span>
            <span className="shrink-0 text-right">
              <span className="num block text-[18px] font-bold leading-[20px] text-text">{clock(recorder.elapsed)}</span>
              <span className="block text-[12px] font-medium text-text">{uploading ? "Saving…" : "Tap to finish"}</span>
            </span>
          </button>
          {recorder.micError && <p className="mt-[10px] text-center text-[12.5px] text-text-3">{recorder.micError}</p>}
          <button type="button" onClick={recorder.cancel} disabled={uploading} className="mx-auto mt-[18px] block text-[14px] font-medium text-text-2 hover:text-text">
            Cancel recording
          </button>
        </>
      ) : (
        <>
          <div className="mt-[22px] flex flex-col gap-[10px] sm:flex-row sm:items-center sm:justify-between lg:mt-[24px]">
            <span className="text-[13.5px] font-medium text-text-2">Answer length</span>
            <div
              role="radiogroup"
              aria-label="Answer length"
              className="flex rounded-full p-[4px]"
              style={{ background: `color-mix(in srgb, ${c.tint} 40%, #ece9e8)` }}
            >
              {([90, 240] as Duration[]).map((d) => {
                const on = round.durationSeconds === d;
                return (
                  <button
                    key={d}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={pending}
                    onClick={() => !on && apply(setDuration(round.id, d))}
                    className={cx(
                      "flex h-[42px] flex-1 items-center justify-center gap-[7px] rounded-full px-[16px] transition-colors sm:flex-none",
                      on ? "bg-white shadow-[0_1px_3px_rgba(20,39,26,0.08)]" : "text-text-2 hover:text-text",
                    )}
                  >
                    <span className={cx("text-[15px] font-bold", on ? "text-text" : "text-text-2")}>{lengthLabel(d)}</span>
                    <span className={cx("text-[12.5px]", on ? "text-text" : "text-text-2")}>{d === 240 ? "Full case" : "Quick answer"}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            onClick={recorder.start}
            disabled={pending}
            className="group mt-[14px] flex h-[66px] w-full items-center gap-[14px] rounded-full bg-ink pl-[10px] text-left text-white transition-colors hover:bg-forest lg:mt-[13px] lg:h-[72px] lg:pl-[13px]"
          >
            <span className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-lime text-ink transition-transform group-hover:scale-105 lg:h-[50px] lg:w-[50px]">
              <MicIcon className="h-[20px] w-[20px]" />
            </span>
            <span>
              <span className="block text-[16.5px] font-medium leading-[21px]">Start answering</span>
              <span className="block text-[13px] leading-[18px] text-white/60">Tap to record · {lengthLabel(round.durationSeconds)}</span>
            </span>
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => apply(differentQuestion(round.id))}
            className="mx-auto mt-[18px] flex items-center gap-[8px] text-[14px] font-medium text-text-2 hover:text-text"
          >
            <ShuffleIcon className="h-[15px] w-[15px]" />
            Different question
          </button>
        </>
      )}
      {error && <p className="mt-3 text-center text-[13px] text-danger">{error}</p>}
    </div>
  );
}
