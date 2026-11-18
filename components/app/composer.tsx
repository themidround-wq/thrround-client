"use client";

import { useState, useTransition, type FormEvent } from "react";
import { ArrowUpIcon, ShuffleIcon } from "@/components/app-icons";
import { cx } from "@/components/ui";
import { CATEGORIES } from "@/lib/practice/catalog";
import type { CategoryId } from "@/lib/practice/types";

/** Best topic match for free text ("let's do newborn", "pharm", "surprise me"). */
export function matchTopic(text: string): CategoryId | "surprise" {
  const t = text.toLowerCase();
  if (!t.trim() || /surprise|random|anything/.test(t)) return "surprise";
  const words = t.split(/[^a-z]+/).filter((w) => w.length > 2);
  let best: { id: CategoryId; score: number } | null = null;
  for (const c of Object.values(CATEGORIES)) {
    const names = `${c.name} ${c.phrase}`.toLowerCase();
    const score = words.filter((w) => names.includes(w) || names.split(/[^a-z]+/).some((n) => n.startsWith(w) || w.startsWith(n.slice(0, 5)))).length;
    if (score && (!best || score > best.score)) best = { id: c.id, score };
  }
  return best?.id ?? "surprise";
}

/** Bottom bar: shuffle = surprise me; typing a topic starts it. */
export function Composer({ onTopic, className }: { onTopic: (id: CategoryId | "surprise") => Promise<unknown>; className?: string }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const go = (id: CategoryId | "surprise") =>
    start(async () => {
      await onTopic(id);
      setText("");
    });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) go(matchTopic(text));
  };
  return (
    <form onSubmit={submit} className={cx("flex h-[60px] items-center gap-[12px] rounded-full bg-[#eceee7] pl-[8px] pr-[8px]", className)}>
      <button
        type="button"
        onClick={() => go("surprise")}
        disabled={pending}
        aria-label="Surprise me"
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white text-text-2 shadow-[0_1px_2px_rgba(20,39,26,0.06)] transition-colors hover:text-text"
      >
        <ShuffleIcon className="h-[17px] w-[17px]" />
      </button>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={pending}
        aria-label="Ask for a topic"
        placeholder="Ask for a topic, or say “surprise me”"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-3"
      />
      <button
        type="submit"
        disabled={!text.trim() || pending}
        aria-label="Start"
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-ink text-lime transition-colors disabled:bg-[#ccd0c8] disabled:text-white"
      >
        <ArrowUpIcon className="h-[18px] w-[18px]" />
      </button>
    </form>
  );
}
