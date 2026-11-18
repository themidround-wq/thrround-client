import { redirect } from "next/navigation";
import { Suspense } from "react";
import { startSession } from "@/app/actions/practice";
import { Composer } from "@/components/app/composer";
import { TopBar } from "@/components/app/shell";
import { TopicChips } from "@/components/app/topic-chips";
import { getMe } from "@/lib/api";
import { topicsFor } from "@/lib/practice/catalog";
import { greeting } from "@/lib/practice/format";
import { DeletedToast } from "./deleted-toast";

async function Home({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const [{ user }, sp] = await Promise.all([getMe(), searchParams]);
  if (!user.onboarded) redirect("/onboarding");
  const deleted = typeof sp.deleted === "string" ? sp.deleted : null;

  return (
    <>
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-[20px] pb-[40px] lg:pb-[90px]">
        <p className="flex items-center gap-[9px] text-[15px] font-medium text-text-2">
          <span className="h-[8px] w-[8px] rounded-full bg-[#75c94b]" />
          {greeting()}, {user.name}
        </p>
        <h2 className="mt-[16px] text-center leading-[1.02] lg:mt-[18px]">
          <span className="block text-[40px] font-medium tracking-[-0.06em] text-text lg:text-[52px]">What shall we</span>
          <span className="block font-serif text-[42px] italic tracking-[-0.02em] text-moss lg:text-[58px]">practise today?</span>
        </h2>
        <div className="mt-[30px] w-full max-w-[600px] lg:mt-[36px]">
          <TopicChips topics={topicsFor(user.course)} onPick={startSession} />
        </div>
      </main>
      <div className="relative shrink-0 px-[12px] pb-[12px] lg:px-0 lg:pb-[20px]">
        <Composer onTopic={startSession} className="mx-auto w-full lg:max-w-[700px]" />
        {deleted && <DeletedToast id={deleted} label={typeof sp.label === "string" ? sp.label : "Session"} />}
      </div>
    </>
  );
}

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <>
      <TopBar />
      <Suspense fallback={<main className="flex-1" />}>
        <Home searchParams={searchParams} />
      </Suspense>
    </>
  );
}
