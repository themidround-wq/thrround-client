import { Suspense } from "react";
import { ShellProvider } from "@/components/app/shell";
import { Sidebar, SidebarSkeleton } from "@/components/app/sidebar";

/** Signed-in app: session sidebar + page. Pages render their own top bar and composer. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <ShellProvider>
      <div className="flex h-dvh overflow-hidden bg-[#fafbf7]">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </ShellProvider>
  );
}
