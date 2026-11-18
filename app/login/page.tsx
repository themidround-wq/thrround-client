import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ArrowRightIcon, GoogleIcon } from "@/components/icons";
import { ErrorNote, Eyebrow, Heading, Sub } from "@/components/ui";
import { isMock, safeNext } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  cancelled: "Google sign-in was cancelled. Try again when you're ready.",
  state: "That sign-in link expired. Please try again.",
  google: "We couldn't verify your Google account. Please try again.",
  suspended: "This account has been suspended. Contact support@gettheround.com if you think this is a mistake.",
  expired: "Your session ended. Sign in again to carry on.",
  unavailable: "We can't reach the round right now. Please try again in a moment.",
  config: "Google sign-in isn't set up yet.",
};

/** Reads ?error and ?next, so it streams in behind Suspense (Cache Components). */
async function SignIn({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? ERRORS[sp.error] : undefined;
  const next = safeNext(typeof sp.next === "string" ? sp.next : undefined);
  return <GoogleBlock error={error} href={next === "/" ? "/auth/google" : `/auth/google?next=${encodeURIComponent(next)}`} />;
}

function GoogleBlock({ error, href }: { error?: string; href: string }) {
  return (
    <div className="mt-auto pt-[48px] lg:mt-[42px] lg:pt-0">
      {error && (
        <div className="mb-4">
          <ErrorNote>{error}</ErrorNote>
        </div>
      )}
      <Link
        href={href}
        prefetch={false}
        className="group flex h-[60px] items-center rounded-full border border-[#f2f4f1] bg-white pl-[10px] pr-[10px] shadow-[0_8px_24px_-8px_rgba(20,39,26,0.12)] transition-shadow hover:shadow-[0_10px_28px_-8px_rgba(20,39,26,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tint lg:h-[64px] lg:pl-[12px] lg:pr-[12px]"
      >
        <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-chip lg:h-[48px] lg:w-[48px]">
          <GoogleIcon className="h-[17px] w-[17px]" />
        </span>
        <span className="ml-[12px] flex-1 text-[16px] font-bold text-text lg:ml-[11px] lg:text-[15px]">Continue with Google</span>
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-lime text-text transition-transform group-hover:translate-x-0.5 lg:h-[48px] lg:w-[48px]">
          <ArrowRightIcon className="h-[18px] w-[18px]" />
        </span>
      </Link>
      <p className="mt-[20px] text-center text-[12px] leading-none text-text-3 lg:mt-[22px] lg:text-[12px]">
        By continuing, you agree to the{" "}
        <a href="https://gettheround.com/terms" className="text-moss hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="https://gettheround.com/privacy" className="text-moss hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthShell brandOnMobile>
      <div className="flex flex-1 flex-col pt-[30px] lg:flex-none lg:pt-0">
        <Eyebrow>Welcome</Eyebrow>
        <Heading className="mt-[22px] lg:mt-[21px]">
          Ready when
          <br />
          you are.
        </Heading>
        <Sub className="mt-[20px] text-[15px] leading-[22px] lg:mt-[23px] lg:text-[16px]">
          Sign in to start a round or pick up where you left off.
        </Sub>
        <Suspense fallback={<GoogleBlock href="/auth/google" />}>
          <SignIn searchParams={searchParams} />
        </Suspense>
        {isMock() && (
          <p className="mt-[14px] text-center text-[13px] text-text-3">
            Local demo:{" "}
            <a href="/auth/demo" className="font-medium text-moss hover:underline">
              continue as Nkem
            </a>{" "}
            ·{" "}
            <a href="/auth/demo?onboarding=1" className="text-moss hover:underline">
              start from onboarding
            </a>
          </p>
        )}
      </div>
    </AuthShell>
  );
}
