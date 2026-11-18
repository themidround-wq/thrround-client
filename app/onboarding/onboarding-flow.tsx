"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { signOut } from "@/app/actions/auth";
import { finishOnboarding, saveBasics } from "@/app/actions/onboarding";
import { AuthShell } from "@/components/auth/auth-shell";
import { CheckIcon } from "@/components/icons";
import { BackButton, ErrorNote, Eyebrow, Heading, Label, OptionCard, PillButton, Select, Sub, TextInput, cx } from "@/components/ui";
import type { Goal, Stage, User } from "@/lib/types";

const COURSES = ["Nursing", "Midwifery"] as const;
const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"] as const;
const SEMESTERS = ["1st semester", "2nd semester"] as const;
const PROFESSIONS = ["Registered Nurse", "Registered Midwife", "Registered Nurse & Midwife"] as const;

const GOALS: { id: Goal; title: string; description: string }[] = [
  { id: "build_confidence", title: "Build confidence", description: "Speak more naturally and trust what you know." },
  { id: "prepare_for_exams", title: "Prepare for exams", description: "Structure clear answers when the pressure is on." },
];

const pick = <T extends string>(list: readonly T[], value: string | null) => (value && list.includes(value as T) ? value : "");

function Progress({ step, onBack }: { step: 1 | 2; onBack: () => void }) {
  return (
    <div className="flex items-center">
      <BackButton onClick={onBack} />
      <span className="ml-[15px] text-[13px] font-bold leading-none text-text-2 lg:ml-[15px]">{step} of 2</span>
      <div className="ml-[12px] h-[4px] flex-1 overflow-hidden rounded-full bg-track" role="progressbar" aria-valuemin={0} aria-valuemax={2} aria-valuenow={step}>
        <div className="h-full rounded-full bg-moss transition-[width] duration-500" style={{ width: step === 1 ? "50%" : "100%" }} />
      </div>
    </div>
  );
}

export function OnboardingFlow({ user }: { user: User }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Step 1, prefilled from Google / earlier answers.
  const [name, setName] = useState(user.name ?? "");
  const [stage, setStage] = useState<Stage | null>(user.stage);
  const [course, setCourse] = useState(pick(COURSES, user.course));
  const [year, setYear] = useState(pick(YEARS, user.year));
  const [semester, setSemester] = useState(pick(SEMESTERS, user.semester));
  const [profession, setProfession] = useState(pick(PROFESSIONS, user.course));

  // Step 2
  const [avatarId, setAvatarId] = useState<number | null>(user.avatarId);
  const [goal, setGoal] = useState<Goal | null>(user.goal);

  const basicsDone =
    name.trim().length > 0 && (stage === "student" ? Boolean(course && year && semester) : stage === "qualified" && Boolean(profession));

  function submitBasics(e: React.FormEvent) {
    e.preventDefault();
    if (!basicsDone || !stage) return;
    setError(null);
    start(async () => {
      const res = await saveBasics(
        stage === "student" ? { name, stage, course, year, semester } : { name, stage, course: profession },
      );
      if (!res.ok) return setError(res.error);
      setStep(2);
      window.scrollTo({ top: 0 });
    });
  }

  function submitFinish(e: React.FormEvent) {
    e.preventDefault();
    if (!avatarId || !goal) return;
    setError(null);
    start(async () => {
      const res = await finishOnboarding({ avatarId, goal });
      if (res && !res.ok) setError(res.error);
    });
  }

  if (step === 1) {
    return (
      <AuthShell footer="inline" inset="onboarding">
        <form onSubmit={submitBasics} className="pt-[33px] lg:pt-0">
          <Progress step={1} onBack={() => start(() => signOut())} />

          <Eyebrow className="mt-[26px] lg:mt-[39px]">First, the basics</Eyebrow>
          <Heading size="md" className="mt-[18px] lg:mt-[19px]">
            Make it
            <br />
            feel yours.
          </Heading>
          <Sub className="mt-[17px] text-[16px] leading-[26px] lg:mt-[20px] lg:max-w-[400px] lg:text-[15px] lg:leading-[23px]">
            Tell us what to call you and where you are in your nursing or midwifery journey.
          </Sub>

          <Label htmlFor="name" className="mt-[24px] lg:mt-[36px]">
            Your name
          </Label>
          <TextInput
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Nkem"
            autoComplete="given-name"
            maxLength={60}
            className="mt-[12px] lg:mt-[11.5px]"
          />

          <p className="mt-[23px] text-[14px] font-medium leading-none text-text lg:mt-[25px] lg:pl-[2px] lg:text-[13px]">Your Stage</p>
          <div role="radiogroup" aria-label="Your stage" className="mt-[14px] lg:mt-[13px] grid grid-cols-2 gap-[8px] lg:gap-[10px]">
            <OptionCard selected={stage === "student"} onClick={() => setStage("student")} title="Student" description="I'm currently studying" />
            <OptionCard selected={stage === "qualified"} onClick={() => setStage("qualified")} title="Qualified" description="I'm keeping in practice" />
          </div>

          {stage === "qualified" ? (
            <>
              <Label htmlFor="profession" className="mt-[26px]">
                Profession
              </Label>
              <Select
                id="profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Choose your profession"
                options={PROFESSIONS}
                className="mt-[12px] lg:mt-[11.5px]"
              />
            </>
          ) : (
            <>
              <Label htmlFor="course" className="mt-[26px] lg:mt-[25px]">
                Course
              </Label>
              <Select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Choose your course"
                options={COURSES}
                className="mt-[12px] lg:mt-[11.5px]"
              />
              <div className="mt-[18px] grid grid-cols-2 gap-[12px] lg:mt-[19px]">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Choose year" options={YEARS} className="mt-[12px] lg:mt-[11.5px]" />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    id="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="Choose semester"
                    options={SEMESTERS}
                    className="mt-[12px] lg:mt-[11.5px]"
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="mt-5">
              <ErrorNote>{error}</ErrorNote>
            </div>
          )}

          <PillButton type="submit" disabled={!basicsDone || pending} className="mt-[39px] lg:mt-[29px]">
            {pending ? "Saving…" : "Continue"}
          </PillButton>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell inset="onboarding">
      <form onSubmit={submitFinish} className="pt-[33px] lg:pt-0">
        <Progress step={2} onBack={() => setStep(1)} />

        <Eyebrow className="mt-[26px] lg:mt-[40px]">Last step</Eyebrow>
        <Heading size="md" className="mt-[18px] lg:mt-[19.5px]">
          How will you
          <br />
          show up?
        </Heading>
        <Sub className="mt-[17px] text-[16px] leading-[26px] lg:mt-[21px] lg:max-w-[400px] lg:leading-[25px]">
          Choose an avatar and the outcome you want from your practice.
        </Sub>

        <p className="mt-[23px] text-[14px] font-medium leading-none text-text lg:mt-[36px] lg:text-[13px]">Choose your avatar</p>
        <div role="radiogroup" aria-label="Choose your avatar" className="mt-[12px] grid max-w-[370px] grid-cols-5 gap-y-[5px] lg:mt-[12px] lg:max-w-none lg:grid-cols-6 lg:gap-y-[10px]">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((id) => {
            const selected = avatarId === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Avatar ${id}`}
                onClick={() => setAvatarId(id)}
                className="group relative flex h-[60px] w-[60px] items-center justify-center rounded-full lg:h-[68px] lg:w-[68px]"
              >
                <span
                  className={cx(
                    "absolute inset-0 rounded-full border-2 transition-colors",
                    selected ? "border-moss" : "border-transparent group-hover:border-ring/50",
                  )}
                />
                <span className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[#f2f4f1] bg-white shadow-[0_2px_6px_rgba(20,39,26,0.08)] lg:h-[62px] lg:w-[62px]">
                  <Image src={`/avatars/${id}.png`} alt="" width={64} height={64} className="h-[48px] w-[48px] rounded-full lg:h-[52px] lg:w-[52px]" />
                </span>
                {selected && (
                  <span className="absolute -bottom-[1px] -right-[1px] flex h-[19px] w-[19px] items-center justify-center rounded-full border-2 border-white bg-moss text-white lg:h-[21px] lg:w-[21px]">
                    <CheckIcon className="h-[10px] w-[10px]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-[26px] text-[14px] font-medium leading-none text-text lg:mt-[29px] lg:text-[13px]">What do you want to build?</p>
        <div role="radiogroup" aria-label="What do you want to build?" className="mt-[12px] grid gap-[12px] lg:mt-[12.5px] lg:grid-cols-2">
          {GOALS.map((g) => {
            const selected = goal === g.id;
            return (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setGoal(g.id)}
                className={cx(
                  "relative rounded-[18px] border px-[17px] pb-[23px] pt-[27px] text-left transition-colors lg:h-[112px] lg:pb-[22px] lg:pt-[26px]",
                  selected ? "border-2 border-ring bg-[#f0f6ec] px-[16px] pt-[26px] lg:pt-[25px]" : "border-[#eef1ec] bg-white hover:border-ring/50",
                )}
              >
                <span className="flex items-center gap-[9px]">
                  <span className={cx("h-[10px] w-[10px] rounded-full", selected ? "bg-moss" : "bg-dot-off")} />
                  <span className="text-[14.5px] font-medium leading-none text-text lg:text-[15px]">{g.title}</span>
                </span>
                <span className="mt-[13px] block pl-[19px] text-[12px] leading-[18px] text-text-3 lg:pr-[20px]">{g.description}</span>
                {selected && (
                  <span className="absolute right-[16px] top-[16px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-moss text-white lg:right-[16px] lg:top-[16px]">
                    <CheckIcon className="h-[11px] w-[11px]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-5">
            <ErrorNote>{error}</ErrorNote>
          </div>
        )}

        <PillButton type="submit" disabled={!avatarId || !goal || pending} className="mt-[25px] lg:mt-[29px]">
          {pending ? "Setting up…" : "Enter The Round"}
        </PillButton>
      </form>
    </AuthShell>
  );
}
