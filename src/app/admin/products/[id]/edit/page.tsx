"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { adminGetProductById } from "@/lib/api/admin";
import { ApiRequestError } from "@/lib/api/client";
import type { ApiProduct } from "@/lib/api/types";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetProductById(id)
      .then(setProduct)
      .catch((err) =>
        setError(err instanceof ApiRequestError ? err.message : "Could not load product.")
      );
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl">Edit Product</h1>
      {error ? <p className="text-sm text-ink-soft">{error}</p> : null}
      {product ? (
        <ProductForm initialProduct={product} />
      ) : !error ? (
        <p className="text-sm text-ink-soft">Loading…</p>
      ) : null}
    </div>
  );
}
