import type { Metadata } from "next";
import { Suspense } from "react";
import { queryProducts } from "@/data/products";
import { getAllCategories } from "@/data/categories";
import type { SortOption } from "@/lib/product-query";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { Pagination } from "@/components/products/Pagination";
import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";
import { Container } from "@/components/ui/Layout";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse curated fashion deals from M&T Collection, filterable by category, season and price.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    season?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    featured?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const [{ items, page, totalPages, total }, categories] = await Promise.all([
    queryProducts({
      category: params.category,
      season: params.season,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort as SortOption | undefined,
      featured: params.featured === "true",
      page: params.page ? Number(params.page) : 1,
    }),
    getAllCategories(),
  ]);

  return (
    <Container className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl">
          {params.featured === "true" ? "Featured Deals" : "All Products"}
        </h1>
        <p className="text-sm text-ink-soft">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <Suspense fallback={null}>
            <ProductFilters categories={categories} />
          </Suspense>
        </aside>

        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
            <Suspense fallback={null}>
              <ProductSort />
            </Suspense>
          </div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid
              products={items}
              emptyMessage="No products match these filters."
            />
          </Suspense>
          <Suspense fallback={null}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
