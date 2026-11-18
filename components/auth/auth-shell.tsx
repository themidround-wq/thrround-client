import type { ReactNode } from "react";
import { cx } from "@/components/ui";
import { BrandHeader, BrandPanel } from "./brand-panel";

export function AuthFooter({ className }: { className?: string }) {
  return (
    <footer className={cx("flex items-center justify-between text-[10.5px] leading-none text-text-3 lg:text-[12.5px]", className)}>
      <span>© The Round</span>
      <span>Practice with purpose.</span>
    </footer>
  );
}

/**
 * Frame shared by sign-in and onboarding.
 * Desktop: mist canvas, rounded frame, brand panel left, paper panel right.
 * Mobile: full-bleed paper; the brand header shows only when `brandOnMobile`.
 *
 * `footer="pinned"` keeps the footer at the bottom of the panel (sign-in, step 2);
 * `footer="inline"` centres content and footer together (step 1, which is tall).
 */
export function AuthShell({
  children,
  brandOnMobile = false,
  footer = "pinned",
  inset = "login",
}: {
  children: ReactNode;
  brandOnMobile?: boolean;
  footer?: "pinned" | "inline";
  inset?: "login" | "onboarding";
}) {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:min-h-[760px] lg:p-[15px]">
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row lg:rounded-[24px]">
        <BrandPanel wide={inset === "onboarding"} />
        {brandOnMobile && <BrandHeader />}

        <main
          className={cx(
            "flex flex-1 flex-col overflow-y-auto bg-paper px-[18px] pb-[17px] lg:pb-[30px]",
            footer === "pinned" ? "lg:pt-[102px]" : "lg:pt-[56px]",
            inset === "login" ? "lg:pl-[80px] lg:pr-[85px]" : "lg:pl-[80px] lg:pr-[79px]",
          )}
        >
          {footer === "pinned" ? (
            <>
              <div className="flex w-full flex-1 flex-col lg:max-w-[490px] lg:justify-center">{children}</div>
              <AuthFooter className="mt-[48px] w-full lg:max-w-[490px]" />
            </>
          ) : (
            <div className="flex w-full flex-1 flex-col lg:max-w-[490px] lg:justify-center lg:pb-[26px]">
              {children}
              <AuthFooter className="mt-auto pt-[48px] lg:mt-[50px] lg:pt-0" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
