"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { adminListCategories, adminDeleteCategory } from "@/lib/api/admin";
import { ApiRequestError } from "@/lib/api/client";
import type { ApiCategory } from "@/lib/api/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setCategories(await adminListCategories());
      setError(null);
    } catch {
      setError("Could not load categories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This only works if no products use it.`)) return;
    try {
      await adminDeleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err instanceof ApiRequestError ? err.message : "Could not delete category.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 rounded-tag bg-ink px-4 py-2.5 text-sm font-medium text-paper hover:bg-marigold hover:text-ink"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Category
        </Link>
      </div>

      {error ? <p className="text-sm text-ink-soft">{error}</p> : null}
      {isLoading ? <p className="text-sm text-ink-soft">Loading…</p> : null}

      {!isLoading && categories.length === 0 ? (
        <p className="text-sm text-ink-soft">No categories yet.</p>
      ) : null}

      {categories.length > 0 ? (
        <div className="overflow-x-auto rounded-card border border-mist bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-mist text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-mist last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.slug}</td>
                  <td className="px-4 py-3">
                    {c.active ? (
                      <CheckCircle2 className="h-4 w-4 text-pine" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-4 w-4 text-ink-soft" aria-hidden="true" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/categories/${c._id}/edit`}
                        className="text-ink-soft hover:text-ink"
                        aria-label={`Edit ${c.name}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(c._id, c.name)}
                        className="text-ink-soft hover:text-marigold-dark"
                        aria-label={`Delete ${c.name}`}
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
