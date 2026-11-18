import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Eyebrow, Heading, Sub } from "@/components/ui";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = { title: "Two-factor sign-in" };

// Not in the Section 1 designs: built from the same parts as sign-in.
async function Form({ searchParams }: { searchParams: PageProps<"/login/verify">["searchParams"] }) {
  const sp = await searchParams;
  return <VerifyForm next={typeof sp.next === "string" ? sp.next : ""} />;
}

export default function VerifyPage({ searchParams }: PageProps<"/login/verify">) {
  return (
    <AuthShell brandOnMobile>
      <div className="flex flex-1 flex-col pt-[40px] lg:flex-none lg:pt-0">
        <Eyebrow>One more step</Eyebrow>
        <Heading className="mt-[22px] lg:mt-[29px]">
          Check your
          <br />
          code.
        </Heading>
        <Sub className="mt-[26px] text-[15px] leading-[22px] lg:mt-[22px] lg:text-[16px]">
          Enter the 6-digit code from your authenticator app, or one of your recovery codes.
        </Sub>
        <Suspense fallback={<VerifyForm next="" />}>
          <Form searchParams={searchParams} />
        </Suspense>
      </div>
    </AuthShell>
  );
}
