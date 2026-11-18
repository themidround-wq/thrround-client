"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, use, useEffect, useState, type ReactNode } from "react";
import Logo from "@/public/Logo-on-whitebg.png";
import { MenuIcon, PlusIcon, XIcon } from "@/components/app-icons";
import { cx } from "@/components/ui";

const DrawerContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} });

export function ShellProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <DrawerContext value={{ open, setOpen }}>{children}</DrawerContext>;
}

/** Sidebar frame: fixed column on desktop, slide-over drawer on mobile. */
export function SidebarFrame({ children }: { children: ReactNode }) {
  const { open, setOpen } = use(DrawerContext);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
  return (
    <>
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cx("fixed inset-0 z-40 bg-ink/30 transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <aside
        // Any link inside (session, new session, profile) closes the mobile drawer.
        onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col bg-[#f2f4ee] transition-transform duration-300 lg:static lg:z-auto lg:w-[268px] lg:shrink-0 lg:translate-x-0 lg:transition-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[62px] shrink-0 items-center justify-between pl-[20px] pr-[24px] lg:h-[72px] lg:pr-[12px]">
          <Link href="/" aria-label="the round — home">
            <Image src={Logo} alt="the round" className="w-[100px]" priority />
          </Link>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="text-text-2 lg:hidden">
            <XIcon className="h-[20px] w-[20px]" />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}

export function NewSessionButton() {
  return (
    <Link
      href="/"
      className="mx-[12px] flex h-[46px] shrink-0 items-center gap-[11px] rounded-full bg-ink pl-[7px] text-[15px] font-medium text-white transition-colors hover:bg-forest"
    >
      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-lime text-ink">
        <PlusIcon className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      New session
    </Link>
  );
}

/** Sidebar history link with active state from the current path. */
export function HistoryLink({ href, children }: { href: string; children: ReactNode }) {
  const active = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "mx-[12px] flex h-[42px] items-center gap-[10px] rounded-full pl-[6px] pr-[12px] transition-colors",
        active ? "bg-white shadow-[0_1px_2px_rgba(20,39,26,0.04)]" : "hover:bg-white/60",
      )}
    >
      {children}
    </Link>
  );
}

/** Page header: desktop title row; on mobile a centred title between menu and new-session buttons. */
export function TopBar({ title, meta, actions }: { title?: ReactNode; meta?: ReactNode; actions?: ReactNode }) {
  const { setOpen } = use(DrawerContext);
  return (
    <header className="relative z-10 flex h-[60px] shrink-0 items-center justify-between px-[20px] lg:h-[62px] lg:px-[32px] lg:pr-[28px]">
      <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="-ml-[2px] text-text lg:hidden">
        <MenuIcon className="h-[22px] w-[22px]" strokeWidth={1.6} />
      </button>
      <div className="absolute left-1/2 top-1/2 max-w-[60%] -translate-x-1/2 -translate-y-1/2 text-center lg:static lg:max-w-none lg:translate-x-0 lg:translate-y-0 lg:text-left">
        {title && (
          <div className="flex flex-col items-center lg:flex-row lg:items-baseline lg:gap-[10px]">
            <h1 className="truncate text-[15px] font-medium text-text lg:text-[15.5px]">{title}</h1>
            {meta && <span className="text-[11.5px] text-text-3 lg:text-[12px]">{meta}</span>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-[14px]">
        <span className="hidden items-center gap-[18px] lg:flex">{actions}</span>
        <Link href="/" aria-label="New session" className="text-text lg:hidden">
          <PlusIcon className="h-[24px] w-[24px]" strokeWidth={1.6} />
        </Link>
      </div>
    </header>
  );
}
