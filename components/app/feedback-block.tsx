import { CheckIcon, PlusIcon, SparkleIcon } from "@/components/app-icons";
import { cx } from "@/components/ui";
import type { Feedback } from "@/lib/practice/types";

/** Scored feedback after a round (design 07). */
export function FeedbackBlock({ feedback, transcript }: { feedback: Feedback; transcript?: string | null }) {
  return (
    <div className="pt-[2px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <span className="flex h-[30px] items-center gap-[6px] rounded-full bg-[#e7f4dc] px-[12px] text-[13.5px] font-medium text-[#3f7a26]">
          <SparkleIcon className="h-[12px] w-[12px]" />
          Feedback
        </span>
        <span className="num flex h-[30px] items-center rounded-full bg-ink px-[12px] text-[14.5px] font-bold text-white">
          {feedback.score}
          <span className="text-[11.5px] font-medium text-white/70">/100</span>
        </span>
        <span className="text-[13.5px] font-medium text-text-2">{feedback.verdict}</span>
      </div>

      <p className="mt-[14px] text-[15.5px] leading-[26px] text-text lg:text-[16px]">{feedback.summary}</p>

      <div className="mt-[16px] flex flex-wrap gap-[6px]">
        {feedback.metrics.map((m) => (
          <span
            key={m.label}
            className="num flex h-[31px] items-center gap-[9px] rounded-full px-[12px] text-[13px] font-medium text-text"
            style={{ background: `linear-gradient(90deg, #d7e3ce ${m.score}%, #ebefe6 ${m.score}%)` }}
          >
            {m.label}
            <span className="font-bold">{m.score}</span>
          </span>
        ))}
      </div>

      <h3 className="mt-[26px] text-[14.5px] font-bold text-text">What worked</h3>
      <ul className="mt-[8px] space-y-[12px]">
        {feedback.worked.map((w) => (
          <li key={w} className="flex gap-[13px] text-[15px] leading-[22px] text-text">
            <span className="mt-[8px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#75c94b]" />
            {w}
          </li>
        ))}
      </ul>

      <h3 className="mt-[24px] text-[14.5px] font-bold text-text">What to work on</h3>
      <ul className="mt-[8px] space-y-[14px]">
        {feedback.workOn.map((w) => (
          <li key={w.point}>
            <p className="flex gap-[13px] text-[15px] leading-[22px] text-text">
              <span className="mt-[8px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#e0a33a]" />
              {w.point}
            </p>
            <p className="ml-[22px] mt-[8px] rounded-[14px] bg-[#f4f1e6] px-[14px] py-[10px] text-[14px] italic leading-[22px] text-text-2 lg:max-w-[598px]">
              <span className="font-bold not-italic text-[#c4892b]">Try saying: </span>
              {w.trySaying}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="mt-[24px] text-[14.5px] font-bold text-text">What examiners listen for</h3>
      <div className="mt-[10px] grid gap-[10px] sm:grid-cols-2 lg:max-w-[620px]">
        {feedback.examiner.map((p) => (
          <div
            key={p.label}
            className={cx(
              "flex min-h-[52px] items-center gap-[12px] rounded-[26px] py-[8px] pl-[8px] pr-[14px]",
              p.covered ? "border border-[#e3e6df] bg-white" : "border border-dashed border-[#dfe2db]",
            )}
          >
            <span className={cx("flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full", p.covered ? "bg-[#e7f4dc] text-[#539037]" : "bg-[#f1f2ee] text-text-3")}>
              {p.covered ? <CheckIcon className="h-[13px] w-[13px]" strokeWidth={2.4} /> : <PlusIcon className="h-[13px] w-[13px]" strokeWidth={2.2} />}
            </span>
            <span className={cx("min-w-0 flex-1 text-[13.5px] leading-[18px]", p.covered ? "text-text" : "text-text-2")}>{p.label}</span>
            <span className={cx("shrink-0 text-[12px] font-bold", p.covered ? "text-[#539037]" : "text-text-3 font-medium")}>{p.covered ? "Covered" : "Missed"}</span>
          </div>
        ))}
      </div>

      {transcript && (
        <details className="mt-[18px] rounded-[16px] bg-[#f4f6f1] px-[16px] py-[12px] lg:max-w-[620px]">
          <summary className="cursor-pointer text-[13.5px] font-medium text-text-2">What you said</summary>
          <p className="mt-[8px] text-[14px] leading-[22px] text-text-2">{transcript}</p>
        </details>
      )}
    </div>
  );
}
