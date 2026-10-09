import type { Product } from "@/types/product";
import { SHOW_DEMO_DATA } from "@/lib/config";
import { isApiConfigured, apiGet, apiGetPaginated } from "@/lib/api/client";
import { mapApiProduct } from "@/lib/api/mappers";
import type { ApiProduct } from "@/lib/api/types";
import { filterAndSortProducts, type ProductQuery, DEFAULT_PAGE_SIZE } from "@/lib/product-query";
import { realProducts } from "./real-products";
import { mockProducts } from "./mock-products";

/**
 * DATA LAYER — LOCAL vs API MODE
 *
 * Every exported function here checks isApiConfigured() (true only
 * when NEXT_PUBLIC_API_URL is set) and either calls the Stage 3
 * backend or falls back to the Stage 1/2 local arrays below. Every
 * call site elsewhere in the app (pages, sections, sitemap) is
 * unaware of which mode is active — they just `await` these
 * functions, exactly as the Stage 3 integration is meant to work:
 * the UI adapts to whichever data source is configured, without
 * being rewritten per mode.
 */

/** Real, verified M&T Collection products (local-mode source only). */
export { realProducts };

/** Demo/mock products used only for UI development & testing (local-mode only). */
export { mockProducts };

const localProducts: Product[] = SHOW_DEMO_DATA
  ? [...realProducts, ...mockProducts]
  : realProducts;

export interface ProductPage {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function buildQueryString(query: ProductQuery & { page?: number; limit?: number }) {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.season) params.set("season", query.season);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.sort) params.set("sort", query.sort);
  if (query.featured) params.set("featured", "true");
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? DEFAULT_PAGE_SIZE));
  return params.toString();
}

/**
 * The main entry point for /products and /category/[slug]: filtered,
 * sorted, and paginated. In API mode this hits the backend directly
 * (which does the work in MongoDB); in local mode it filters the
 * in-memory array and slices a page out of it, so pagination behaves
 * identically either way.
 */
export async function queryProducts(
  query: ProductQuery & { page?: number; limit?: number }
): Promise<ProductPage> {
  const page = query.page ?? 1;
  const limit = query.limit ?? DEFAULT_PAGE_SIZE;

  if (isApiConfigured()) {
    const result = await apiGetPaginated<ApiProduct>(
      `/api/products?${buildQueryString(query)}`,
      60
    );
    return {
      items: result.data.map(mapApiProduct),
      page: result.pagination.page,
      limit: result.pagination.limit,
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
    };
  }

  const filtered = filterAndSortProducts(localProducts, query);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return { items, page, limit, total, totalPages };
}

export async function getAllProducts(): Promise<Product[]> {
  if (isApiConfigured()) {
    const result = await queryProducts({ limit: 48 });
    return result.items;
  }
  return localProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (isApiConfigured()) {
    try {
      const raw = await apiGet<ApiProduct>(`/api/products/${slug}`, 60);
      return mapApiProduct(raw);
    } catch {
      return undefined;
    }
  }
  return localProducts.find((p) => p.slug === slug);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const result = await queryProducts({ category: categorySlug, limit: 48 });
  return result.items;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const result = await queryProducts({ featured: true, limit: 8 });
  return result.items;
}

export async function getTrendingProducts(): Promise<Product[]> {
  if (isApiConfigured()) {
    const result = await apiGetPaginated<ApiProduct>("/api/products?trending=true&limit=8", 60);
    return result.data.map(mapApiProduct);
  }
  return localProducts.filter((p) => p.trending).slice(0, 8);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const sameCategory = await getProductsByCategory(product.categorySlug);
  return sameCategory.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  if (isApiConfigured()) {
    const result = await apiGetPaginated<ApiProduct>(
      `/api/products?search=${encodeURIComponent(q)}&limit=24`
    );
    return result.data.map(mapApiProduct);
  }

  const lower = q.toLowerCase();
  return localProducts.filter((p) =>
    [p.title, p.category, p.description, ...p.tags]
      .join(" ")
      .toLowerCase()
      .includes(lower)
  );
}
