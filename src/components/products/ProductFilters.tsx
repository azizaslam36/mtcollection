"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { SEASON_OPTIONS } from "@/lib/product-query";
import type { Category } from "@/types/category";

const PRICE_BRACKETS = [
  { label: "Under ₹500", max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "Over ₹1,000", min: 1000 },
];

export function ProductFilters({
  categories,
  hideCategory = false,
}: {
  categories: Category[];
  hideCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSeason = searchParams.get("season") ?? "";
  const activeMin = searchParams.get("minPrice") ?? "";
  const activeMax = searchParams.get("maxPrice") ?? "";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function applyPriceBracket(bracket: (typeof PRICE_BRACKETS)[number]) {
    const params = new URLSearchParams(searchParams.toString());
    const isActive =
      params.get("minPrice") === String(bracket.min ?? "") &&
      params.get("maxPrice") === String(bracket.max ?? "");

    if (isActive) {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      if (bracket.min) params.set("minPrice", String(bracket.min));
      else params.delete("minPrice");
      if (bracket.max) params.set("maxPrice", String(bracket.max));
      else params.delete("maxPrice");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const hasActiveFilters = Boolean(
    activeCategory || activeSeason || activeMin || activeMax
  );

  return (
    <div className="flex flex-col gap-5 rounded-card border border-mist bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
        </div>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-marigold-dark"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </button>
        ) : null}
      </div>

      {!hideCategory ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Category
          </legend>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <FilterChip
                key={cat.slug}
                label={cat.name}
                active={activeCategory === cat.slug}
                onClick={() =>
                  updateParam(
                    "category",
                    activeCategory === cat.slug ? null : cat.slug
                  )
                }
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Season
        </legend>
        <div className="flex flex-wrap gap-2">
          {SEASON_OPTIONS.map((season) => (
            <FilterChip
              key={season}
              label={season}
              active={activeSeason === season}
              onClick={() =>
                updateParam("season", activeSeason === season ? null : season)
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Price
        </legend>
        <div className="flex flex-wrap gap-2">
          {PRICE_BRACKETS.map((bracket) => (
            <FilterChip
              key={bracket.label}
              label={bracket.label}
              active={
                activeMin === String(bracket.min ?? "") &&
                activeMax === String(bracket.max ?? "")
              }
              onClick={() => applyPriceBracket(bracket)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-tag border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-mist bg-paper text-ink-soft hover:border-ink"
      }`}
    >
      {label}
    </button>
  );
}
