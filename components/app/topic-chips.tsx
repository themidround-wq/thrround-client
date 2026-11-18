"use client";

import { useTransition } from "react";
import { CategoryIcon, ShuffleIcon } from "@/components/app-icons";
import { cx } from "@/components/ui";
import { CATEGORIES } from "@/lib/practice/catalog";
import type { CategoryId } from "@/lib/practice/types";

/** Topic pills + "Surprise me". `onPick` runs a server action (start or switch topic). */
export function TopicChips({
  topics,
  onPick,
  size = "lg",
  align = "center",
}: {
  topics: CategoryId[];
  onPick: (id: CategoryId | "surprise") => Promise<unknown>;
  size?: "lg" | "sm";
  align?: "center" | "start";
}) {
  const [pending, start] = useTransition();
  const lg = size === "lg";
  const chip = cx(
    "group flex items-center rounded-full transition-[transform,filter] hover:brightness-[0.97] active:scale-[0.98] disabled:opacity-60",
    lg ? "h-[46px] gap-[11px] pl-[5px] pr-[18px] text-[15px]" : "h-[40px] gap-[10px] pl-[4px] pr-[16px] text-[14px]",
  );
  const circle = cx("flex items-center justify-center rounded-full", lg ? "h-[36px] w-[36px]" : "h-[32px] w-[32px]");
  const pick = (id: CategoryId | "surprise") => start(() => onPick(id).then(() => undefined));

  return (
    <div className={cx("flex flex-wrap gap-[10px]", align === "center" ? "justify-center" : "justify-start", lg ? "gap-y-[10px]" : "gap-y-[10px]")}>
      {topics.map((id) => {
        const c = CATEGORIES[id];
        return (
          <button key={id} type="button" disabled={pending} onClick={() => pick(id)} className={chip} style={{ background: c.tint }}>
            <span className={cx(circle, "bg-white")} style={{ color: c.ink }}>
              <CategoryIcon id={id} className="h-[17px] w-[17px]" />
            </span>
            <span className="font-bold text-text">{c.name}</span>
          </button>
        );
      })}
      <button type="button" disabled={pending} onClick={() => pick("surprise")} className={cx(chip, "bg-ink text-white hover:brightness-110")}>
        <span className={cx(circle, "bg-lime text-ink")}>
          <ShuffleIcon className="h-[17px] w-[17px]" />
        </span>
        <span className="font-bold">{pending ? "Starting…" : "Surprise me"}</span>
      </button>
    </div>
  );
}
