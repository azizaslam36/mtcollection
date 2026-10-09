/**
 * Shapes returned by the Stage 3 backend (server/src/...), as JSON —
 * i.e. before mapping into the frontend's existing Product/Category
 * types (see mappers.ts). Kept separate from src/types/product.ts and
 * src/types/category.ts on purpose: those are the frontend's stable
 * UI-facing contract that every component already depends on: the
 * API's own shape (Mongo _id, populated category object, etc.) should
 * never leak into components directly.
 */

export interface ApiCategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ApiCategoryRef | string;
  season?: string;
  platform: "Amazon" | "Flipkart" | "Myntra" | "Meesho" | "Other";
  brand?: string;
  affiliateUrl: string;
  tags: string[];
  priority: number;
  featured: boolean;
  trending: boolean;
  active: boolean;
  isDemo: boolean;
  rating?: number;
  reviewCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiPaginatedSuccess<T> {
  success: true;
  data: T[];
  pagination: ApiPagination;
  message: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: unknown;
}
