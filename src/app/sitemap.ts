import type { MetadataRoute } from "next";
import { isApiConfigured, apiGetPaginated, apiGet } from "@/lib/api/client";
import type { ApiProduct, ApiCategory } from "@/lib/api/types";
import { realProducts } from "@/data/products";
import { realCategories } from "@/data/categories";

const BASE_URL = "https://mtcollection.in";

/**
 * Deliberately never includes demo data, in either mode:
 * - API mode: the public /api/products and /api/categories endpoints
 *   already exclude isDemo products and inactive/unpublished ones by
 *   design (server/src/controllers/product.controller.ts
 *   publicBaseFilter, hard-disabled in production regardless of
 *   config — see server/src/config/env.ts `showDemoData`).
 * - Local mode: uses realProducts/realCategories directly rather than
 *   the SHOW_DEMO_DATA-mixed getAllProducts()/getAllCategories(), so
 *   a local dev environment with demo data turned on for browsing
 *   never leaks demo URLs into the sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/search`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
  ];

  let productSlugs: string[] = [];
  let categorySlugs: string[] = [];

  if (isApiConfigured()) {
    try {
      // NOTE: fetches a single page (max 48). Fine for the current
      // catalog size — once the catalog grows past that, this needs
      // to loop over `pagination.totalPages` and concatenate results.
      const [productsResult, categories] = await Promise.all([
        apiGetPaginated<ApiProduct>("/api/products?limit=48", 3600),
        apiGet<ApiCategory[]>("/api/categories", 3600),
      ]);
      productSlugs = productsResult.data.map((p) => p.slug);
      categorySlugs = categories.map((c) => c.slug);
    } catch {
      // If the API is unreachable at build/request time, fall back to
      // the static routes only rather than failing sitemap generation.
      productSlugs = [];
      categorySlugs = [];
    }
  } else {
    productSlugs = realProducts.map((p) => p.slug);
    categorySlugs = realCategories.map((c) => c.slug);
  }

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
