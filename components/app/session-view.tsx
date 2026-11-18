"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { changeTopic, deleteSession, nextQuestion, pickTopic, renameSession, retake, reviewRound } from "@/app/actions/practice";
import { ArrowRightIcon, PencilIcon, RotateIcon, TrashIcon } from "@/components/app-icons";
import { cx } from "@/components/ui";
import type { CategoryId, PracticeSession } from "@/lib/practice/types";
import { Composer } from "./composer";
import { DeleteDialog } from "./delete-dialog";
import { FeedbackBlock } from "./feedback-block";
import { AnsweredCard, QuestionCard } from "./question-card";
import { TopBar } from "./shell";
import { TopicChips } from "./topic-chips";

type Res = { ok: true; session: PracticeSession } | { ok: false; error: string };

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[80%] rounded-[22px] bg-[#e8eee2] px-[17px] py-[10px] text-[15px] leading-[24px] text-text">{children}</p>
    </div>
  );
}

function Typing({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-[12px] text-[15px] text-text-2">
      <span className="flex gap-[4px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[7px] w-[7px] animate-bounce rounded-full bg-moss" style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }} />
        ))}
      </span>
      {label}
    </p>
  );
}

export function SessionView({ initial, topics }: { initial: PracticeSession; topics: CategoryId[] }) {
  const [session, setSession] = useState(initial);
  const [pending, start] = useTransition();
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(initial.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);
  const reviewing = useRef<string | null>(null);

  // A new session id (navigating between sessions) resets local state.
  const [sessionId, setSessionId] = useState(initial.id);
  if (initial.id !== sessionId) {
    setSessionId(initial.id);
    setSession(initial);
    setTitle(initial.title);
  }

  const apply = (p: Promise<Res>) =>
    start(async () => {
      const res = await p;
      if (res.ok) setSession(res.session);
    });

  const last = session.rounds.at(-1)!;
  const reviewed = session.rounds.filter((r) => r.status === "reviewed" && r.feedback);
  const avg = reviewed.length ? Math.round(reviewed.reduce((a, r) => a + r.feedback!.score, 0) / reviewed.length) : null;

  // Recorded → fetch feedback ("Listening back to your answer…").
  useEffect(() => {
    if (last.status !== "recorded" || reviewing.current === last.id) return;
    reviewing.current = last.id;
    const t = setTimeout(async () => {
      const res = await reviewRound(last.id);
      if (res.ok) setSession(res.session);
    }, 1600);
    return () => clearTimeout(t);
  }, [last.id, last.status]);

  // Keep the newest message in view.
  const lastKey = `${session.rounds.length}-${last.status}-${session.pickingTopic}`;
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lastKey]);

  const saveTitle = () => {
    setRenaming(false);
    if (title.trim() && title.trim() !== session.title) apply(renameSession(session.id, title));
    else setTitle(session.title);
  };

  const titleNode = renaming ? (
    <input
      autoFocus
      value={title}
      maxLength={80}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={saveTitle}
      onKeyDown={(e) => {
        if (e.key === "Enter") saveTitle();
        if (e.key === "Escape") {
          setTitle(session.title);
          setRenaming(false);
        }
      }}
      aria-label="Session name"
      className="w-[220px] rounded-lg border border-field bg-white px-2 py-1 text-[15px] font-medium text-text outline-none focus:border-ring"
    />
  ) : (
    <button type="button" onClick={() => setRenaming(true)} className="max-w-full truncate text-left hover:text-moss" title="Rename session">
      {session.title}
    </button>
  );

  return (
    <>
      <TopBar
        title={titleNode}
        meta={avg !== null ? `${reviewed.length} round${reviewed.length === 1 ? "" : "s"} · average ${avg}` : undefined}
        actions={
          <>
            <button type="button" onClick={() => setRenaming(true)} aria-label="Rename session" className="text-text-2 transition-colors hover:text-text">
              <PencilIcon className="h-[17px] w-[17px]" />
            </button>
            <button type="button" onClick={() => setConfirmDelete(true)} aria-label="Delete session" className="text-text-2 transition-colors hover:text-danger">
              <TrashIcon className="h-[17px] w-[17px]" />
            </button>
          </>
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[740px] space-y-[24px] px-[16px] pb-[28px] pt-[18px] lg:px-[20px] lg:pt-[36px]">
          {session.rounds.map((r, i) => {
            const isLast = i === session.rounds.length - 1;
            return (
              <section key={r.id} className="space-y-[24px]">
                <UserBubble>{r.prompt}</UserBubble>
                <p className="text-[15.5px] leading-[24px] text-text lg:text-[16px]">{r.intro}</p>
                {r.status === "ready" ? <QuestionCard round={r} onSession={setSession} /> : <AnsweredCard round={r} />}
                {r.status === "recorded" && <Typing label="Listening back to your answer…" />}
                {r.feedback && <FeedbackBlock feedback={r.feedback} transcript={r.transcript} />}
                {isLast && r.status === "reviewed" && (
                  <div className="flex flex-wrap gap-[8px] pt-[2px]">
                    <button type="button" disabled={pending} onClick={() => apply(retake(session.id))} className={btn("outline")}>
                      <RotateIcon className="h-[15px] w-[15px]" /> Try again
                    </button>
                    <button type="button" disabled={pending} onClick={() => apply(nextQuestion(session.id))} className={btn("dark")}>
                      Next question <ArrowRightIcon className="h-[16px] w-[16px] text-lime" />
                    </button>
                    {!session.pickingTopic && (
                      <button type="button" disabled={pending} onClick={() => apply(changeTopic(session.id))} className={btn("outline")}>
                        Change topic
                      </button>
                    )}
                  </div>
                )}
              </section>
            );
          })}
          {session.pickingTopic && (
            <section className="space-y-[12px]">
              <p className="text-[16px] text-text">Of course. What would you like to practise next?</p>
              <TopicChips topics={topics} size="sm" align="start" onPick={(id) => pickTopic(session.id, id).then((res) => res.ok && setSession(res.session))} />
            </section>
          )}
          <div ref={bottom} />
        </div>
      </main>

      <div className="shrink-0 px-[12px] pb-[12px] lg:px-0 lg:pb-[20px]">
        <Composer
          className="mx-auto w-full lg:max-w-[700px]"
          onTopic={(id) => pickTopic(session.id, id).then((res) => res.ok && setSession(res.session))}
        />
      </div>

      {confirmDelete && (
        <DeleteDialog title={session.title} onKeep={() => setConfirmDelete(false)} onDelete={() => deleteSession(session.id)} />
      )}
    </>
  );
}

const btn = (kind: "outline" | "dark") =>
  cx(
    "flex h-[42px] items-center gap-[8px] rounded-full px-[18px] text-[15px] font-medium transition-colors disabled:opacity-60",
    kind === "dark" ? "bg-ink text-white hover:bg-forest" : "border border-[#e3e6df] bg-white text-text hover:bg-[#f4f6f1]",
  );
