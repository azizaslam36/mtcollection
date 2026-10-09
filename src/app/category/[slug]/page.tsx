import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getAllCategories } from "@/data/categories";
import { queryProducts } from "@/data/products";
import type { SortOption } from "@/lib/product-query";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSort } from "@/components/products/ProductSort";
import { Pagination } from "@/components/products/Pagination";
import { Container } from "@/components/ui/Layout";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateStaticParams() {
  // Best-effort: works whether the category list came from the API
  // or local files. If the API is unreachable at build time, Next.js
  // will fall back to rendering these routes on-demand instead.
  try {
    const categories = await getAllCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort, page: pageParam } = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { items, page, totalPages, total } = await queryProducts({
    category: slug,
    sort: sort as SortOption | undefined,
    page: pageParam ? Number(pageParam) : 1,
  });

  return (
    <Container className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl">{category.name}</h1>
        <p className="max-w-2xl text-ink-soft">{category.description}</p>
        <p className="text-sm text-ink-soft">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="flex justify-end">
          <Suspense fallback={null}>
            <ProductSort />
          </Suspense>
        </div>
      ) : null}

      <ProductGrid
        products={items}
        emptyMessage={`No products in ${category.name} yet.`}
      />

      <Suspense fallback={null}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </Container>
  );
}
