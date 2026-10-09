import type { Product, Season } from "@/types/product";

/**
 * Shared sort vocabulary between the frontend and the backend API
 * (server/src/validators/product.validator.ts + product.controller.ts
 * SORT_MAP use these exact same string values). Keeping one shared
 * vocabulary means no translation layer between local-mode filtering
 * and API-mode querying — one less place for the two to drift apart.
 */
export type SortOption = "newest" | "price-low" | "price-high" | "discount" | "featured";

export interface ProductQuery {
  category?: string;
  season?: Season | string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  /** When true, only products marked `featured` are returned. Powers
   *  the navbar's "Deals" link (/products?featured=true). */
  featured?: boolean;
}

/**
 * Pure filter+sort helper used only in LOCAL DATA MODE (when
 * NEXT_PUBLIC_API_URL isn't set — see src/lib/api/client.ts). When
 * the API is configured, src/data/products/index.ts sends this same
 * query shape to the backend instead, which applies the equivalent
 * filtering/sorting/pagination in MongoDB. Kept here so the frontend
 * still works standalone with zero backend, exactly as it did in
 * Stage 1/2.
 */
export function filterAndSortProducts(
  products: Product[],
  query: ProductQuery
): Product[] {
  let result = products;

  if (query.category) {
    result = result.filter((p) => p.categorySlug === query.category);
  }

  if (query.season) {
    result = result.filter((p) => p.season === query.season);
  }

  if (typeof query.minPrice === "number") {
    result = result.filter((p) => p.price >= query.minPrice!);
  }

  if (typeof query.maxPrice === "number") {
    result = result.filter((p) => p.price <= query.maxPrice!);
  }

  if (query.featured) {
    result = result.filter((p) => p.featured);
  }

  switch (query.sort) {
    case "price-low":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "discount":
      result = [...result].sort(
        (a, b) => (b.discount ?? 0) - (a.discount ?? 0)
      );
      break;
    case "featured":
      result = [...result].sort(
        (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
      );
      break;
    case "newest":
    default:
      // Local catalog order stands in for "newest" — the array is
      // already in the order the real products were migrated in.
      break;
  }

  return result;
}

export const SEASON_OPTIONS: Season[] = [
  "Summer",
  "Winter",
  "Monsoon",
  "Festive",
  "All Season",
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "featured", label: "Featured first" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "discount", label: "Biggest discount" },
];

export const DEFAULT_PAGE_SIZE = 12;
