import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getMe } from "@/lib/api";
import { OnboardingFlow } from "./onboarding-flow";

export const metadata: Metadata = { title: "Set up" };

async function Flow() {
  const { user } = await getMe();
  if (user.onboarded) redirect("/");
  return <OnboardingFlow user={user} />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-paper" />}>
      <Flow />
    </Suspense>
  );
}
