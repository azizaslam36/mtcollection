"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { adminGetCategoryById } from "@/lib/api/admin";
import { ApiRequestError } from "@/lib/api/client";
import type { ApiCategory } from "@/lib/api/types";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetCategoryById(id)
      .then(setCategory)
      .catch((err) =>
        setError(err instanceof ApiRequestError ? err.message : "Could not load category.")
      );
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">Edit Category</h1>
      {error ? <p className="text-sm text-ink-soft">{error}</p> : null}
      {category ? (
        <CategoryForm initialCategory={category} />
      ) : !error ? (
        <p className="text-sm text-ink-soft">Loading…</p>
      ) : null}
    </div>
  );
}
