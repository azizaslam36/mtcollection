"use client";

/**
 * Admin API calls, meant to be called ONLY from Client Components
 * (see the header comment in src/app/admin/layout.tsx for why: the
 * backend's httpOnly auth cookie lives on the API's own origin, so it
 * can only be read/sent from the browser — Next.js Server Components
 * running on the Node server have no access to it during SSR).
 *
 * Reuses the same apiGet/apiPost/etc primitives as the public data
 * layer (src/lib/api/client.ts) — those already set
 * credentials: "include", which is exactly what's needed once the
 * fetch actually executes in the browser.
 */
import { apiGet, apiGetPaginated, apiPost, apiPut, apiPatch, apiDelete } from "./client";
import type { ApiProduct, ApiCategory, ApiPaginatedSuccess } from "./types";

export interface AdminSession {
  id: string;
  email: string;
}

export interface AdminProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  trending?: boolean;
  active?: boolean;
  sort?: string;
}

function buildQuery(params: object) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  return search.toString();
}

// --- Auth ---
export const adminLogin = (email: string, password: string) =>
  apiPost<AdminSession>("/api/auth/login", { email, password });

export const adminLogout = () => apiPost<null>("/api/auth/logout");

export const adminMe = () => apiGet<AdminSession>("/api/auth/me");

// --- Products ---
export const adminListProducts = (
  query: AdminProductQuery = {}
): Promise<ApiPaginatedSuccess<ApiProduct>> =>
  apiGetPaginated<ApiProduct>(`/api/products/admin/all?${buildQuery(query)}`);

export const adminGetProductById = (id: string) =>
  apiGet<ApiProduct>(`/api/products/admin/${id}`);

export interface ProductFormInput {
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  category: string;
  season?: string;
  platform: string;
  brand?: string;
  affiliateUrl: string;
  tags?: string[];
  featured?: boolean;
  trending?: boolean;
  active?: boolean;
}

export const adminCreateProduct = (input: ProductFormInput) =>
  apiPost<ApiProduct>("/api/products", input);

export const adminUpdateProduct = (id: string, input: Partial<ProductFormInput>) =>
  apiPut<ApiProduct>(`/api/products/${id}`, input);

export const adminDeleteProduct = (id: string) =>
  apiDelete<null>(`/api/products/${id}`);

export const adminSetProductFlag = (
  id: string,
  flag: "publish" | "featured" | "trending",
  value: boolean
) => apiPatch<ApiProduct>(`/api/products/${id}/${flag}`, { value });

// --- Categories ---
export const adminListCategories = () =>
  apiGet<ApiCategory[]>("/api/categories/admin/all");

export const adminGetCategoryById = (id: string) =>
  apiGet<ApiCategory>(`/api/categories/admin/${id}`);

export interface CategoryFormInput {
  name: string;
  slug?: string;
  description: string;
  image?: string;
  active?: boolean;
  featured?: boolean;
}

export const adminCreateCategory = (input: CategoryFormInput) =>
  apiPost<ApiCategory>("/api/categories", input);

export const adminUpdateCategory = (id: string, input: Partial<CategoryFormInput>) =>
  apiPut<ApiCategory>(`/api/categories/${id}`, input);

export const adminDeleteCategory = (id: string) =>
  apiDelete<null>(`/api/categories/${id}`);

// --- Affiliate import ---
export interface AffiliateImportResult {
  platform: string;
  automated: boolean;
  message: string;
  metadata?: {
    title?: string;
    price?: number;
    originalPrice?: number;
    image?: string;
    description?: string;
    platform: string;
    externalUrl: string;
  };
}

export const adminImportAffiliateUrl = (url: string) =>
  apiPost<AffiliateImportResult>("/api/affiliate/import", { url });
