import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SessionView } from "@/components/app/session-view";
import { TopBar } from "@/components/app/shell";
import { getMe } from "@/lib/api";
import { topicsFor } from "@/lib/practice/catalog";
import { practice } from "@/lib/practice/repo";

async function Session({ params }: { params: PageProps<"/s/[id]">["params"] }) {
  const { id } = await params;
  const [{ user }, session] = await Promise.all([getMe(), (await practice()).getSession(id)]);
  if (!session) notFound();
  return <SessionView initial={session} topics={topicsFor(user.course)} />;
}

export default function SessionPage({ params }: PageProps<"/s/[id]">) {
  return (
    <Suspense
      fallback={
        <>
          <TopBar />
          <main className="flex-1" />
        </>
      }
    >
      <Session params={params} />
    </Suspense>
  );
}
