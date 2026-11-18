import { CategoryIcon } from "@/components/app-icons";
import { CATEGORIES } from "@/lib/practice/catalog";
import type { CategoryId } from "@/lib/practice/types";

/** Tinted circle with the category icon (sidebar rows, chips use their own). */
export function CategoryDot({ id, size = 30, white = false }: { id: CategoryId; size?: number; white?: boolean }) {
  const c = CATEGORIES[id];
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size, background: white ? "#fff" : c.tint, color: c.ink }}>
      <CategoryIcon id={id} className="h-[16px] w-[16px]" />
    </span>
  );
}
