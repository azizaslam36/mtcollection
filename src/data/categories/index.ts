import type { Category } from "@/types/category";
import { SHOW_DEMO_DATA } from "@/lib/config";
import { isApiConfigured, apiGet } from "@/lib/api/client";
import { mapApiCategory } from "@/lib/api/mappers";
import type { ApiCategory } from "@/lib/api/types";
import { realCategories } from "./real-categories";
import { mockCategories } from "./mock-categories";
import { getProductsByCategory } from "../products";

/** Real, verified M&T Collection categories (local-mode source only). */
export { realCategories };

/** Demo/mock categories used only for UI development & testing (local-mode only). */
export { mockCategories };

const localCategories: Category[] = SHOW_DEMO_DATA
  ? [...realCategories, ...mockCategories]
  : realCategories;

/**
 * Same local-vs-API pattern as src/data/products/index.ts. See that
 * file's header comment for the full explanation.
 */
export async function getAllCategories(): Promise<Category[]> {
  if (isApiConfigured()) {
    const raw = await apiGet<ApiCategory[]>("/api/categories", 300);
    return raw.map(mapApiCategory);
  }
  return localCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (isApiConfigured()) {
    try {
      const raw = await apiGet<ApiCategory>(`/api/categories/${slug}`, 300);
      return mapApiCategory(raw);
    } catch {
      return undefined;
    }
  }
  return localCategories.find((c) => c.slug === slug);
}

/**
 * Number of products currently in a category. Category pages use
 * this to decide whether to render the product grid or the empty
 * state (see the "accessories" demo category in local mode, which is
 * deliberately empty for that purpose).
 */
export async function getCategoryProductCount(categorySlug: string): Promise<number> {
  const products = await getProductsByCategory(categorySlug);
  return products.length;
}
