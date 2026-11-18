"use client";

import Link from "next/link";
import { useActionState } from "react";
import { verifyTwoFactor, type VerifyState } from "@/app/actions/auth";
import { ErrorNote, Label, PillButton, TextInput } from "@/components/ui";

export function VerifyForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<VerifyState, FormData>(verifyTwoFactor, {});
  return (
    <form action={action} className="mt-auto pt-[48px] lg:mt-[40px] lg:pt-0">
      <input type="hidden" name="next" value={next} />
      <Label htmlFor="code">Authentication code</Label>
      <TextInput
        id="code"
        name="code"
        inputMode="text"
        autoComplete="one-time-code"
        autoFocus
        required
        maxLength={40}
        placeholder="123 456"
        className="num mt-[13px] tracking-[0.12em]"
      />
      {state.error && (
        <div className="mt-4">
          <ErrorNote>{state.error}</ErrorNote>
        </div>
      )}
      <PillButton type="submit" disabled={pending} className="mt-[30px]">
        {pending ? "Checking…" : "Verify and continue"}
      </PillButton>
      <p className="mt-[20px] text-center text-[13px] text-text-3">
        Wrong account?{" "}
        <Link href="/login" className="text-moss hover:underline">
          Start again
        </Link>
      </p>
    </form>
  );
}
