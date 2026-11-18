"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { restoreSession } from "@/app/actions/practice";

/** "Deleted … · Undo" pill over the composer (design 12). Disappears after 8 s. */
export function DeletedToast({ id, label }: { id: string; label: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/", { scroll: false }), 8000);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <div role="status" className="absolute inset-x-[12px] bottom-[18px] flex justify-center lg:inset-x-0 lg:bottom-[26px] lg:-translate-x-[66px]">
      <div className="flex h-[48px] max-w-full items-center gap-[12px] rounded-full bg-ink pl-[20px] pr-[6px] text-white shadow-[0_8px_24px_-6px_rgba(20,39,26,0.35)] animate-[toast-in_180ms_ease-out]">
        <span className="truncate text-[14px] font-medium">Deleted “{label}”</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => restoreSession(id))}
          className="h-[36px] shrink-0 rounded-full bg-lime px-[16px] text-[14px] font-medium text-ink transition-transform hover:scale-[1.03]"
        >
          {pending ? "Restoring…" : "Undo"}
        </button>
      </div>
    </div>
  );
}
