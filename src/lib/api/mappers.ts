import type { ApiProduct, ApiCategory } from "./types";
import type { Product, Season } from "@/types/product";
import type { Category } from "@/types/category";

const VALID_SEASONS: Season[] = ["Summer", "Winter", "Monsoon", "Festive", "All Season"];

/**
 * Converts a raw API product into the SAME Product shape the Stage
 * 1/2 UI already consumes (ProductCard, ProductGrid, product detail
 * page, etc.) — so none of that component code has to change for
 * Stage 3. This is the one place that knows about Mongo's `_id` /
 * populated `category` object; everything downstream only ever sees
 * the stable frontend Product type.
 */
export function mapApiProduct(raw: ApiProduct): Product {
  const category =
    typeof raw.category === "string"
      ? { name: "Uncategorized", slug: "uncategorized" }
      : raw.category;

  const season = VALID_SEASONS.includes(raw.season as Season)
    ? (raw.season as Season)
    : undefined;

  return {
    id: raw._id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    image: raw.images[0] ?? "",
    images: raw.images,
    price: raw.price,
    originalPrice: raw.originalPrice,
    discount: raw.discount,
    category: category.name,
    categorySlug: category.slug,
    season,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    featured: raw.featured,
    trending: raw.trending,
    affiliateUrl: raw.affiliateUrl,
    platform: raw.platform,
    tags: raw.tags,
    isDemo: raw.isDemo,
  };
}

export function mapApiCategory(raw: ApiCategory): Category {
  return {
    id: raw._id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    image: raw.image,
    // The database never contains demo categories in production (the
    // backend hard-disables isDemo product exposure outside dev — see
    // server/src/config/env.ts `showDemoData`), so anything sourced
    // from the API is, by definition, real.
    isDemo: false,
  };
}
