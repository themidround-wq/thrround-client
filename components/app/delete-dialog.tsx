"use client";

import { useEffect, useRef, useTransition } from "react";
import { TrashIcon } from "@/components/app-icons";

/** "Delete this session?" confirmation (design 12a). */
export function DeleteDialog({ title, onKeep, onDelete }: { title: string; onKeep: () => void; onDelete: () => Promise<unknown> }) {
  const [pending, start] = useTransition();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onKeep();
      }}
      onClick={(e) => e.target === ref.current && onKeep()}
      aria-labelledby="delete-title"
      className="m-auto w-[calc(100%-32px)] max-w-[420px] rounded-[28px] bg-[#fafbf7] p-0 shadow-[0_24px_60px_-12px_rgba(20,39,26,0.3)] backdrop:bg-[#14271a]/35"
    >
      <div className="p-[24px] lg:p-[29px]">
        <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fbe9e6] text-[#b4321f]">
          <TrashIcon className="h-[17px] w-[17px]" />
        </span>
        <h2 id="delete-title" className="mt-[20px] text-[26px] font-bold tracking-[-0.04em] text-text">
          Delete this session?
        </h2>
        <p className="mt-[10px] text-[14px] font-medium text-text">{title}</p>
        <p className="mt-[8px] text-[14px] leading-[23px] text-text-2">Your recording and feedback for this session will be removed from history.</p>
        <div className="mt-[24px] grid grid-cols-2 gap-[10px]">
          <button type="button" autoFocus onClick={onKeep} disabled={pending} className="h-[44px] rounded-full border border-[#e3e6df] bg-white text-[14px] font-medium text-text hover:bg-[#f4f6f1]">
            Keep session
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => start(() => onDelete().then(() => undefined))}
            className="h-[44px] rounded-full bg-[#a83e3e] text-[14px] font-medium text-white hover:bg-[#962f2f]"
          >
            {pending ? "Deleting…" : "Delete session"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
