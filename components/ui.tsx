import type { ComponentProps, ReactNode } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon } from "./icons";

/**
 * the round — UI kit (App V2, light). Sizes are measured from the 1x designs;
 * see CLAUDE.md → Design system.
 */

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------- Type ---------- */

/** Green caps label above a heading: "WELCOME", "FIRST, THE BASICS". */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("text-[13px] font-bold uppercase leading-none tracking-[0.075em] text-moss", className)}>
      {children}
    </p>
  );
}

/** Page heading on paper: "Ready when you are." */
export function Heading({ children, size = "lg", className }: { children: ReactNode; size?: "lg" | "md"; className?: string }) {
  return (
    <h1
      className={cx(
        "font-medium tracking-[-0.06em] text-text lg:tracking-[-0.07em]",
        size === "lg"
          ? "text-[44.5px] leading-[0.935] lg:text-[68px] lg:leading-[0.935]"
          : "text-[41px] leading-[0.935] lg:text-[57px] lg:leading-[0.935]",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function Sub({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("text-text-2", className)}>{children}</p>;
}

/* ---------- Form ---------- */

export function Label({ children, htmlFor, className }: { children: ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cx("block text-[14px] font-medium leading-none text-text lg:text-[13px]", className)}>
      {children}
    </label>
  );
}

const fieldBase =
  "h-[58px] w-full rounded-2xl border border-field bg-white px-[18px] text-[16px] text-text outline-none transition-colors placeholder:text-text-3 focus:border-ring focus:ring-4 focus:ring-tint lg:h-[58px]";

export function TextInput({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cx(fieldBase, className)} {...rest} />;
}

/** Native select styled like the design; the placeholder option shows in the same ink. */
export function Select({
  className,
  placeholder,
  options,
  ...rest
}: Omit<ComponentProps<"select">, "children"> & { placeholder: string; options: readonly string[] }) {
  return (
    <div className={cx("relative", className)}>
      <select className={cx(fieldBase, "cursor-pointer appearance-none pr-12")} {...rest}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-[18px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-text" />
    </div>
  );
}

/** Two-line selectable card (Student / Qualified). */
export function OptionCard({
  selected,
  title,
  description,
  className,
  ...rest
}: Omit<ComponentProps<"button">, "title"> & { selected: boolean; title: string; description: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cx(
        "h-[62px] rounded-2xl border px-[14px] text-left transition-colors lg:h-[65px]",
        selected ? "border-ring bg-tint ring-[3px] ring-tint" : "border-field bg-white hover:border-ring/60",
        className,
      )}
      {...rest}
    >
      <span className="block text-[15px] font-medium leading-none text-text">{title}</span>
      <span className="mt-[9px] block text-[11px] leading-none text-text-3">{description}</span>
    </button>
  );
}

/* ---------- Buttons ---------- */

/** Full-width pill with a lime arrow circle on the right ("Continue →"). */
export function PillButton({ children, className, ...rest }: ComponentProps<"button">) {
  return (
    <button
      className={cx(
        "group flex h-[60px] w-full items-center justify-between rounded-full bg-forest pl-[21px] pr-[7px] text-[15px] font-bold text-white transition-colors",
        "hover:bg-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-white/70",
        className,
      )}
      {...rest}
    >
      {children}
      <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lime text-forest transition-transform group-hover:translate-x-0.5 group-disabled:translate-x-0 group-disabled:bg-disabled-circle group-disabled:text-disabled">
        <ArrowRightIcon className="h-5 w-5" />
      </span>
    </button>
  );
}

/** Round back button used above onboarding steps. */
export function BackButton(props: ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Back"
      className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-field bg-white text-text transition-colors hover:bg-tint"
      {...props}
    >
      <ArrowLeftIcon className="h-[18px] w-[18px]" />
    </button>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-danger-soft px-4 py-3 text-[14px] text-danger">{children}</p>;
}
