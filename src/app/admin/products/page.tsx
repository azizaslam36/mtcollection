"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star, TrendingUp, Eye, EyeOff } from "lucide-react";
import {
  adminListProducts,
  adminDeleteProduct,
  adminSetProductFlag,
} from "@/lib/api/admin";
import type { ApiProduct } from "@/lib/api/types";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminListProducts({ limit: 48, search: query || undefined });
      setProducts(result.data);
    } catch {
      setError("Could not load products.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await adminDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  async function handleToggle(
    id: string,
    flag: "publish" | "featured" | "trending",
    field: "active" | "featured" | "trending",
    current: boolean
  ) {
    const updated = await adminSetProductFlag(id, flag, !current);
    setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, [field]: updated[field] } : p)));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-tag bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-marigold hover:text-ink"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Product
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(search);
        }}
        className="flex gap-2"
      >
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-tag border border-mist px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-marigold"
        />
        <button
          type="submit"
          className="rounded-tag border border-mist px-4 py-2 text-sm text-ink-soft hover:border-ink hover:text-ink"
        >
          Search
        </button>
      </form>

      {error ? <p className="text-sm text-ink-soft">{error}</p> : null}
      {isLoading ? <p className="text-sm text-ink-soft">Loading…</p> : null}

      {!isLoading && products.length === 0 ? (
        <p className="text-sm text-ink-soft">No products found.</p>
      ) : null}

      {products.length > 0 ? (
        <div className="overflow-x-auto rounded-card border border-mist bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-mist text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-mist last:border-0">
                  <td className="max-w-xs px-4 py-3">
                    <p className="line-clamp-1 font-medium text-ink">{p.title}</p>
                    <p className="text-xs text-ink-soft">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(p._id, "publish", "active", p.active)}
                      className="flex items-center gap-1 text-xs"
                      title={p.active ? "Unpublish" : "Publish"}
                    >
                      {p.active ? (
                        <Eye className="h-4 w-4 text-pine" aria-hidden="true" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-ink-soft" aria-hidden="true" />
                      )}
                      {p.active ? "Published" : "Unpublished"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(p._id, "featured", "featured", p.featured)}
                        title={p.featured ? "Remove from featured" : "Mark featured"}
                      >
                        <Star
                          className={`h-4 w-4 ${p.featured ? "fill-marigold text-marigold" : "text-mist"}`}
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(p._id, "trending", "trending", p.trending)}
                        title={p.trending ? "Remove from trending" : "Mark trending"}
                      >
                        <TrendingUp
                          className={`h-4 w-4 ${p.trending ? "text-pine" : "text-mist"}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="text-ink-soft hover:text-ink"
                        aria-label={`Edit ${p.title}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id, p.title)}
                        className="text-ink-soft hover:text-marigold-dark"
                        aria-label={`Delete ${p.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
