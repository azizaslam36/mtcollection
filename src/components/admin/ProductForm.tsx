"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminCreateProduct,
  adminUpdateProduct,
  adminListCategories,
  adminImportAffiliateUrl,
  type ProductFormInput,
} from "@/lib/api/admin";
import { ApiRequestError } from "@/lib/api/client";
import type { ApiCategory, ApiProduct } from "@/lib/api/types";
import { buttonClasses } from "@/components/ui/Button";

const PLATFORMS = ["Flipkart", "Myntra", "Amazon", "Meesho", "Other"];
const SEASONS = ["", "Summer", "Winter", "Monsoon", "Festive", "All Season"];

interface ProductFormProps {
  /** Pass an existing product to edit; omit to create a new one. */
  initialProduct?: ApiProduct;
}

export function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importUrl, setImportUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const initialCategoryId =
    initialProduct && typeof initialProduct.category !== "string"
      ? initialProduct.category._id
      : "";

  const [form, setForm] = useState({
    title: initialProduct?.title ?? "",
    slug: initialProduct?.slug ?? "",
    description: initialProduct?.description ?? "",
    imagesText: (initialProduct?.images ?? []).join("\n"),
    price: initialProduct?.price?.toString() ?? "",
    originalPrice: initialProduct?.originalPrice?.toString() ?? "",
    category: initialCategoryId,
    season: initialProduct?.season ?? "",
    platform: initialProduct?.platform ?? "Flipkart",
    affiliateUrl: initialProduct?.affiliateUrl ?? "",
    tagsText: (initialProduct?.tags ?? []).join(", "),
    featured: initialProduct?.featured ?? false,
    trending: initialProduct?.trending ?? false,
    active: initialProduct?.active ?? true,
  });

  useEffect(() => {
    adminListCategories()
      .then(setCategories)
      .catch(() => setError("Could not load categories."));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    if (!importUrl.trim()) return;
    setIsImporting(true);
    setImportMessage(null);
    try {
      const result = await adminImportAffiliateUrl(importUrl.trim());
      setImportMessage(result.message);
      // Always fill in the platform + URL, even when automated
      // fetching wasn't possible — that's still useful groundwork for
      // manual entry (see server/src/services/affiliate).
      update("platform", result.platform === "Other" ? form.platform : result.platform);
      update("affiliateUrl", importUrl.trim());
      if (result.metadata) {
        if (result.metadata.title) update("title", result.metadata.title);
        if (result.metadata.description) update("description", result.metadata.description);
        if (result.metadata.price !== undefined) update("price", String(result.metadata.price));
        if (result.metadata.originalPrice !== undefined)
          update("originalPrice", String(result.metadata.originalPrice));
        if (result.metadata.image) update("imagesText", result.metadata.image);
      }
    } catch (err) {
      setImportMessage(
        err instanceof ApiRequestError ? err.message : "Import failed."
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const images = form.imagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = form.tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: ProductFormInput = {
      title: form.title,
      slug: form.slug || undefined,
      description: form.description,
      images,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      season: form.season || undefined,
      platform: form.platform,
      affiliateUrl: form.affiliateUrl,
      tags,
      featured: form.featured,
      trending: form.trending,
      active: form.active,
    };

    try {
      if (isEditing && initialProduct) {
        await adminUpdateProduct(initialProduct._id, payload);
      } else {
        await adminCreateProduct(payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not save product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-card border border-mist bg-white p-4">
        <label className="text-sm font-medium text-ink">
          Import from affiliate URL (optional)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://fktr.in/..."
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting}
            className="whitespace-nowrap rounded-tag border border-ink px-4 py-2 text-sm text-ink hover:bg-ink hover:text-paper"
          >
            {isImporting ? "Checking…" : "Detect"}
          </button>
        </div>
        {importMessage ? <p className="text-xs text-ink-soft">{importMessage}</p> : null}
      </div>

      {error ? <p className="text-sm text-marigold-dark">{error}</p> : null}

      <Field label="Title" required>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Slug (leave blank to auto-generate)">
        <input
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Description" required>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Image URLs (one per line)" required>
        <textarea
          required
          rows={3}
          value={form.imagesText}
          onChange={(e) => update("imagesText", e.target.value)}
          className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price" required>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Original price (optional)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.originalPrice}
            onChange={(e) => update("originalPrice", e.target.value)}
            className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" required>
          <select
            required
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Season">
          <select
            value={form.season}
            onChange={(e) => update("season", e.target.value)}
            className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
          >
            {SEASONS.map((s) => (
              <option key={s || "none"} value={s}>
                {s || "None"}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Platform" required>
          <select
            required
            value={form.platform}
            onChange={(e) => update("platform", e.target.value)}
            className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Affiliate URL" required>
          <input
            required
            type="url"
            value={form.affiliateUrl}
            onChange={(e) => update("affiliateUrl", e.target.value)}
            className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <Field label="Tags (comma-separated)">
        <input
          value={form.tagsText}
          onChange={(e) => update("tagsText", e.target.value)}
          className="w-full rounded-tag border border-mist px-3 py-2 text-sm"
        />
      </Field>

      <div className="flex flex-wrap gap-6">
        <Checkbox
          label="Featured"
          checked={form.featured}
          onChange={(v) => update("featured", v)}
        />
        <Checkbox
          label="Trending"
          checked={form.trending}
          onChange={(v) => update("trending", v)}
        />
        <Checkbox
          label="Published"
          checked={form.active}
          onChange={(v) => update("active", v)}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClasses("primary", "md")}
        >
          {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-ink">
      {label}
      {required ? <span className="text-marigold-dark"> *</span> : null}
      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-mist text-marigold focus-visible:ring-2 focus-visible:ring-marigold"
      />
      {label}
    </label>
  );
}
