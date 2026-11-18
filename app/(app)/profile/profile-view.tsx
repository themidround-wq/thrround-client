"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import { updateProfile, type ProfilePatch } from "@/app/actions/profile";
import {
  ArrowLeftIcon,
  AudioLinesIcon,
  BadgeIcon,
  BookIcon,
  CalendarIcon,
  CameraIcon,
  CapIcon,
  CheckIcon,
  ChevronDownIcon,
  CompassIcon,
  FlameIcon,
  GaugeIcon,
  HourglassIcon,
  SignOutIcon,
  TargetIcon,
  TrophyIcon,
  UserIcon,
} from "@/components/app-icons";
import { Avatar } from "@/components/app/avatar";
import { cx } from "@/components/ui";
import type { PracticeStats } from "@/lib/practice/types";
import type { User } from "@/lib/types";

const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
const SEMESTERS = ["1st semester", "2nd semester"];
const REGISTRATIONS = ["Registered Nurse", "Registered Midwife", "Registered Nurse & Midwife"];
const ordinal = (y: string | null) => {
  const n = Number(y?.replace(/\D/g, ""));
  return n ? `${n}${["th", "st", "nd", "rd"][n % 10 > 3 || Math.floor(n / 10) === 1 ? 0 : n % 10]} year` : null;
};
const isNursing = (c: string | null) => Boolean(c && /nurs/i.test(c) && !/midwi/i.test(c));

function subtitle(u: User) {
  if (u.stage === "qualified") return `${u.course ?? "Qualified"} · Professional practice`;
  return [`Student ${isNursing(u.course) ? "Nurse" : "Midwife"}`, ordinal(u.year), u.semester].filter(Boolean).join(" · ");
}

function Stat({ icon, tint, ink, value, unit, label }: { icon: ReactNode; tint: string; ink: string; value: ReactNode; unit?: string; label: string }) {
  return (
    <div className="rounded-[22px] border border-[#e6e8e2] bg-white px-[14px] pb-[15px] pt-[15px]">
      <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full" style={{ background: tint, color: ink }}>
        {icon}
      </span>
      <p className="num mt-[12px] text-[30px] font-medium leading-none tracking-[-0.03em] text-text">
        {value}
        {unit && <span className="ml-[2px] text-[14px] font-normal tracking-normal text-text-3">{unit}</span>}
      </p>
      <p className="mt-[8px] text-[13px] font-medium text-text-2">{label}</p>
    </div>
  );
}

type RowKey = "name" | "stage" | "course" | "year" | "registration" | "focus" | "length";

export function ProfileView({ user: initial, stats, canUploadPhoto }: { user: User; stats: PracticeStats; canUploadPhoto: boolean }) {
  const [user, setUser] = useState(initial);
  const [open, setOpen] = useState<RowKey | null>(null);
  const [name, setName] = useState(initial.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const file = useRef<HTMLInputElement>(null);

  const save = (patch: ProfilePatch, close = false) => {
    setUser((u) => ({ ...u, ...patch })); // optimistic
    setError(null);
    start(async () => {
      const res = await updateProfile(patch);
      if (res.ok) setUser(res.user);
      else {
        setError(res.error);
        setUser(initial);
      }
      if (close) setOpen(null);
    });
  };

  async function onPhoto(f: File | undefined) {
    if (!f) return;
    // Downscale to a 256px square JPEG data URL before saving.
    const img = await createImageBitmap(f);
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const s = Math.min(img.width, img.height);
    canvas.getContext("2d")!.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
    save({ pictureUrl: canvas.toDataURL("image/jpeg", 0.85), avatarId: null });
  }

  const student = user.stage !== "qualified";
  const toggle = (k: RowKey) => setOpen((o) => (o === k ? null : k));

  const option = (label: ReactNode, selected: boolean, onClick: () => void, key: string) => (
    <button
      key={key}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className="flex h-[48px] w-full items-center justify-between pl-[70px] pr-[26px] text-left transition-colors hover:bg-[#f7f8f4]"
    >
      <span className={cx("text-[15px]", selected ? "font-medium text-text" : "text-text-2")}>{label}</span>
      {selected && <CheckIcon className="h-[17px] w-[17px] text-moss" strokeWidth={2.2} />}
    </button>
  );

  const row = (k: RowKey, icon: ReactNode, tint: string, ink: string, label: string, value: string, body: ReactNode) => {
    const isOpen = open === k;
    return (
      <div key={k} className="border-t border-[#eceee8] first:border-t-0">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => toggle(k)}
          className={cx("flex h-[65px] w-full items-center gap-[14px] px-[14px] text-left transition-colors", isOpen ? "bg-[#f8f9f5]" : "hover:bg-[#fafbf8]")}
        >
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full" style={{ background: tint, color: ink }}>
            {icon}
          </span>
          <span className="flex-1 text-[15.5px] font-medium text-text">{label}</span>
          <span className="max-w-[45%] truncate text-[14px] text-text-2">{value}</span>
          <ChevronDownIcon className={cx("h-[16px] w-[16px] shrink-0 text-text-2 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && <div className="pb-[14px] pt-[2px]">{body}</div>}
      </div>
    );
  };

  const ic = "h-[17px] w-[17px]";

  return (
    <div className="mx-auto w-full max-w-[712px] px-[16px] pb-[48px] pt-[12px] lg:pt-[32px]">
      <Link href="/" className="hidden h-[40px] w-fit items-center gap-[10px] rounded-full border border-[#e3e6df] bg-white px-[16px] text-[14px] font-medium text-text transition-colors hover:bg-[#f4f6f1] lg:flex">
        <ArrowLeftIcon className="h-[15px] w-[15px]" /> Back to practice
      </Link>

      <div className="mt-[18px] flex items-center gap-[20px] lg:mt-[24px] lg:gap-[22px]">
        <span className="rounded-full border-[3px] border-white shadow-[0_2px_10px_rgba(20,39,26,0.1)]">
          <Avatar user={user} size={88} />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[34px] font-medium leading-[1.1] tracking-[-0.04em] text-text lg:text-[42px]">{user.name}</h1>
          <p className="mt-[6px] text-[14px] text-text-2 lg:text-[15px]">{subtitle(user)}</p>
        </div>
      </div>

      <div className="mt-[26px] grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:grid-cols-5">
        <Stat icon={<TargetIcon className={ic} />} tint="#dff4e8" ink="#238d5b" value={stats.rounds} label="Rounds" />
        <Stat icon={<GaugeIcon className={ic} />} tint="#e1effb" ink="#2678b4" value={stats.averageScore ?? "–"} label="Average score" />
        <Stat icon={<TrophyIcon className={ic} />} tint="#fcf0d4" ink="#c98a12" value={stats.bestScore ?? "–"} label="Best score" />
        <Stat icon={<AudioLinesIcon className={ic} />} tint="#f0e8fb" ink="#7d56c8" value={stats.speakingMinutes} unit="min" label="Speaking time" />
        <Stat icon={<FlameIcon className={ic} />} tint="#fdece3" ink="#d9653b" value={stats.streakDays} unit="days" label="Day streak" />
      </div>

      <section className="mt-[16px] rounded-[28px] border border-[#e6e8e2] bg-white px-[20px] pb-[24px] pt-[22px] lg:px-[25px]">
        <h2 className="text-[17px] font-bold text-text">Avatar</h2>
        <p className="mt-[4px] text-[13.5px] text-text-2">{canUploadPhoto ? "Pick one, or use your own photo." : "Pick the one that feels like you."}</p>
        <div className="mt-[18px] flex flex-wrap gap-[10px] lg:gap-[12px]">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((id) => {
            const on = user.avatarId === id && !user.pictureUrl?.startsWith("data:");
            return (
              <button
                key={id}
                type="button"
                aria-label={`Avatar ${id}`}
                aria-pressed={on}
                onClick={() => save({ avatarId: id, pictureUrl: null })}
                className={cx("rounded-full ring-offset-2 transition-shadow", on ? "ring-2 ring-moss" : "hover:ring-2 hover:ring-ring/50")}
              >
                <Image src={`/avatars/${id}.png`} alt="" width={56} height={56} className="h-[52px] w-[52px] rounded-full lg:h-[56px] lg:w-[56px]" />
              </button>
            );
          })}
          {canUploadPhoto && (
          <button
            type="button"
            onClick={() => file.current?.click()}
            aria-label="Use your own photo"
            className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-dashed border-[#cfd3ca] text-text-2 transition-colors hover:border-moss hover:text-moss lg:h-[60px] lg:w-[60px]"
          >
            <CameraIcon className="h-[17px] w-[17px]" />
          </button>
          )}
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => onPhoto(e.target.files?.[0])} />
        </div>
      </section>

      <h2 className="mt-[34px] px-[4px] text-[13.5px] font-medium text-text-2">About you</h2>
      <div role="list" className="mt-[10px] overflow-hidden rounded-[24px] border border-[#e6e8e2] bg-white">
        {row(
          "name",
          <UserIcon className={ic} />,
          "#e1effb",
          "#2678b4",
          "Name",
          user.name ?? "",
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) save({ name: name.trim() }, true);
            }}
            className="flex gap-[8px] pl-[66px] pr-[18px]"
          >
            <input
              autoFocus
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              aria-label="Name"
              className="h-[48px] min-w-0 flex-1 rounded-full bg-[#eceee7] px-[20px] text-[15px] text-text outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button disabled={pending || !name.trim()} className="h-[48px] rounded-full bg-ink px-[22px] text-[14.5px] font-medium text-white hover:bg-forest disabled:opacity-60">
              Save
            </button>
          </form>,
        )}
        {row(
          "stage",
          <CapIcon className={ic} />,
          "#e4e7fa",
          "#4f5bd5",
          "Stage",
          student ? "Still studying" : "Qualified",
          <div role="radiogroup">
            {option("Still studying", student, () => student || save({ stage: "student", course: user.course && /nurse/i.test(user.course) && !/midwi/i.test(user.course) ? "Nursing" : "Midwifery" }), "s")}
            {option("Qualified", !student, () => student && save({ stage: "qualified", course: isNursing(user.course) ? "Registered Nurse" : "Registered Midwife" }), "q")}
          </div>,
        )}
        {student
          ? [
              row(
                "course",
                <BookIcon className={ic} />,
                "#fbe4ea",
                "#cd4f72",
                "Course",
                user.course ?? "Choose",
                <div role="radiogroup">{["Midwifery", "Nursing"].map((c) => option(c, user.course === c, () => save({ course: c }), c))}</div>,
              ),
              row(
                "year",
                <CalendarIcon className={ic} />,
                "#dcf2f1",
                "#2a8a86",
                "Year & semester",
                [user.year, user.semester].filter(Boolean).join(" · ") || "Choose",
                <div>
                  <p className="pb-[4px] pl-[66px] pt-[6px] text-[12.5px] font-medium text-text-2">Year</p>
                  <div role="radiogroup" aria-label="Year">{YEARS.map((y) => option(y, user.year === y, () => save({ year: y }), y))}</div>
                  <p className="pb-[4px] pl-[66px] pt-[10px] text-[12.5px] font-medium text-text-2">Semester</p>
                  <div role="radiogroup" aria-label="Semester">{SEMESTERS.map((s) => option(s, user.semester === s, () => save({ semester: s }), s))}</div>
                </div>,
              ),
            ]
          : row(
              "registration",
              <BadgeIcon className={ic} />,
              "#fbe4ea",
              "#cd4f72",
              "Registration",
              user.course ?? "Choose",
              <div role="radiogroup">{REGISTRATIONS.map((r) => option(r, user.course === r, () => save({ course: r }), r))}</div>,
            )}
      </div>

      <h2 className="mt-[34px] px-[4px] text-[13.5px] font-medium text-text-2">Practice</h2>
      <div className="mt-[10px] overflow-hidden rounded-[24px] border border-[#e6e8e2] bg-white">
        {row(
          "focus",
          <CompassIcon className={ic} />,
          "#dff4e8",
          "#2e9566",
          "Focus",
          user.goal === "prepare_for_exams" ? "Prepare for exams" : "Build confidence",
          <div role="radiogroup">
            {option("Build confidence", user.goal !== "prepare_for_exams", () => save({ goal: "build_confidence" }), "b")}
            {option("Prepare for exams", user.goal === "prepare_for_exams", () => save({ goal: "prepare_for_exams" }), "p")}
          </div>,
        )}
        {row(
          "length",
          <HourglassIcon className={ic} />,
          "#fcf0d4",
          "#c98a12",
          "Default answer length",
          user.defaultResponseSeconds === 240 ? "4 min · Full case" : "1½ min · Quick answer",
          <div role="radiogroup">
            {option(<><span className="font-medium text-text">1½ min</span> <span className="ml-[6px] text-[13px] text-text-3">Quick answer</span></>, user.defaultResponseSeconds !== 240, () => save({ defaultResponseSeconds: 90 }), "90")}
            {option(<><span className="font-medium text-text">4 min</span> <span className="ml-[6px] text-[13px] text-text-3">Full case</span></>, user.defaultResponseSeconds === 240, () => save({ defaultResponseSeconds: 240 }), "240")}
          </div>,
        )}
      </div>

      {error && <p className="mt-4 rounded-2xl bg-danger-soft px-4 py-3 text-[14px] text-danger">{error}</p>}

      <section className="mt-[30px] flex items-center justify-between gap-4 rounded-[26px] border border-[#e6e8e2] bg-white px-[20px] py-[18px] lg:px-[25px]">
        <div>
          <h2 className="text-[16px] font-medium text-text">Sign out</h2>
          <p className="mt-[3px] text-[13px] text-text-2">Your sessions stay saved on this device.</p>
        </div>
        <form action={signOut}>
          <button className="flex h-[44px] items-center gap-[8px] rounded-full border border-[#f0d9d6] bg-white px-[18px] text-[14.5px] font-medium text-[#982e2e] transition-colors hover:bg-danger-soft">
            <SignOutIcon className="h-[16px] w-[16px]" /> Sign out
          </button>
        </form>
      </section>
    </div>
  );
}
