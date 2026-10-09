"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminCreateCategory,
  adminUpdateCategory,
  type CategoryFormInput,
} from "@/lib/api/admin";
import { ApiRequestError } from "@/lib/api/client";
import type { ApiCategory } from "@/lib/api/types";
import { buttonClasses } from "@/components/ui/Button";

interface CategoryFormProps {
  initialCategory?: ApiCategory;
}

export function CategoryForm({ initialCategory }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialCategory);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: initialCategory?.name ?? "",
    slug: initialCategory?.slug ?? "",
    description: initialCategory?.description ?? "",
    image: initialCategory?.image ?? "",
    active: initialCategory?.active ?? true,
    featured: initialCategory?.featured ?? false,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload: CategoryFormInput = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      image: form.image || undefined,
      active: form.active,
      featured: form.featured,
    };

    try {
      if (isEditing && initialCategory) {
        await adminUpdateCategory(initialCategory._id, payload);
      } else {
        await adminCreateCategory(payload);
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not save category.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      {error ? <p className="text-sm text-marigold-dark">{error}</p> : null}

      <label className="flex flex-col gap-1 text-sm text-ink">
        Name <span className="text-marigold-dark">*</span>
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        Slug (leave blank to auto-generate)
        <input
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          className="rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        Description <span className="text-marigold-dark">*</span>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink">
        Image URL
        <input
          type="url"
          value={form.image}
          onChange={(e) => update("image", e.target.value)}
          className="rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
            className="h-4 w-4 rounded border-mist text-marigold"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4 rounded border-mist text-marigold"
          />
          Featured
        </label>
      </div>

      <div>
        <button type="submit" disabled={isSubmitting} className={buttonClasses("primary", "md")}>
          {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create category"}
        </button>
      </div>
    </form>
  );
}
