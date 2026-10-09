import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Category } from "@/types/category";

/**
 * Deliberately a server component: the open/close behavior is done
 * with CSS group-hover/focus-within rather than useState, since no
 * client JS is actually needed for a simple hover/focus dropdown.
 */
export function CategoriesDropdown({ categories }: { categories: Category[] }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-marigold focus-visible:text-marigold"
      >
        Categories
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[180px] translate-y-1 rounded-card border border-white/10 bg-ink py-2 opacity-0 shadow-card transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="block px-4 py-2 text-sm text-paper/90 hover:bg-white/10 hover:text-marigold"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
