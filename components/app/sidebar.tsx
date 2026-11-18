import Link from "next/link";
import { getMe } from "@/lib/api";
import { practice } from "@/lib/practice/repo";
import { historyGroup, historyLabel, roleLabel } from "@/lib/practice/format";
import { Avatar } from "./avatar";
import { CategoryDot } from "./category-badge";
import { HistoryLink, NewSessionButton, SidebarFrame } from "./shell";

const ORDER = ["Today", "This week", "Earlier"] as const;

export async function Sidebar() {
  const [{ user }, sessions] = await Promise.all([getMe(), (await practice()).listSessions()]);
  const groups = ORDER.map((g) => ({ g, items: sessions.filter((s) => historyGroup(s.createdAt) === g) })).filter((x) => x.items.length);

  return (
    <SidebarFrame>
      <NewSessionButton />
      <nav aria-label="Sessions" className="mt-[16px] min-h-0 flex-1 overflow-y-auto pb-4">
        {groups.length === 0 && <p className="px-[24px] pt-[10px] text-[12.5px] text-text-3">Your sessions will show up here.</p>}
        {groups.map(({ g, items }) => (
          <section key={g} className="mb-[16px]">
            <h2 className="mb-[8px] px-[24px] text-[12px] text-text-3">{g}</h2>
            <ul className="space-y-[2px]">
              {items.map((s) => (
                <li key={s.id}>
                  <HistoryLink href={`/s/${s.id}`}>
                    <CategoryDot id={s.categoryId} />
                    <span className="min-w-0 flex-1 truncate text-[14.5px] font-bold text-text">{s.title}</span>
                    <span className="shrink-0 text-[11px] text-text-3">{historyLabel(s.createdAt)}</span>
                  </HistoryLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
      <Link href="/profile" className="flex shrink-0 items-center gap-[12px] px-[20px] pb-[22px] pt-[12px] transition-opacity hover:opacity-80">
        <Avatar user={user} size={38} />
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-bold leading-[18px] text-text">{user.name}</span>
          <span className="block truncate text-[12px] leading-[16px] text-text-2">{roleLabel(user)}</span>
        </span>
      </Link>
    </SidebarFrame>
  );
}

export function SidebarSkeleton() {
  return <aside className="hidden w-[268px] shrink-0 bg-[#f2f4ee] lg:block" />;
}
