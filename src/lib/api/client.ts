import type { ApiFailure, ApiPaginatedSuccess, ApiSuccess } from "./types";

/**
 * Empty string (falsy) when NEXT_PUBLIC_API_URL isn't set. The rest of
 * the app treats that as "run in local-data mode" — see
 * isApiConfigured() and every data-layer function in
 * src/data/products/index.ts and src/data/categories/index.ts, which
 * fall back to the Stage 1/2 local arrays when this is false. This
 * lets the frontend still run standalone (e.g. `npm run dev` with no
 * backend at all) exactly as it did before Stage 3, while production
 * (NEXT_PUBLIC_API_URL set) is fully database-driven.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function isApiConfigured(): boolean {
  return API_URL.length > 0;
}

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

interface FetchOptions extends RequestInit {
  /** Forwarded to Next.js's extended fetch for ISR-style caching.
   *  Omit for always-fresh (e.g. admin reads); pass a number of
   *  seconds for public catalog pages. */
  revalidateSeconds?: number;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!isApiConfigured()) {
    throw new Error(
      "apiFetch called but NEXT_PUBLIC_API_URL is not set. Callers should check isApiConfigured() first."
    );
  }

  const { revalidateSeconds, ...init } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    credentials: "include", // send the admin auth cookie on admin calls
    ...(revalidateSeconds !== undefined
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" }),
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ApiRequestError(res.status, "The server returned an unreadable response.");
  }

  if (!res.ok || (body as ApiFailure).success === false) {
    const message = (body as ApiFailure)?.message ?? "Request failed.";
    throw new ApiRequestError(res.status, message);
  }

  return body as T;
}

export async function apiGet<T>(path: string, revalidateSeconds?: number): Promise<T> {
  const result = await request<ApiSuccess<T>>(path, { method: "GET", revalidateSeconds });
  return result.data;
}

export async function apiGetPaginated<T>(
  path: string,
  revalidateSeconds?: number
): Promise<ApiPaginatedSuccess<T>> {
  return request<ApiPaginatedSuccess<T>>(path, { method: "GET", revalidateSeconds });
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const result = await request<ApiSuccess<T>>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return result.data;
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const result = await request<ApiSuccess<T>>(path, {
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return result.data;
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const result = await request<ApiSuccess<T>>(path, {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return result.data;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const result = await request<ApiSuccess<T>>(path, { method: "DELETE" });
  return result.data;
}
