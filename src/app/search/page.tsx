import type { Metadata } from "next";
import { Suspense } from "react";
import { searchProducts } from "@/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SearchBox } from "@/components/products/SearchBox";
import { Container } from "@/components/ui/Layout";

export const metadata: Metadata = {
  title: "Search",
  description: "Search M&T Collection products by title, category or tag.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const results = q ? await searchProducts(q) : [];

  return (
    <Container className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl">Search</h1>
        <Suspense fallback={null}>
          <SearchBox />
        </Suspense>
      </div>

      {q ? (
        <p className="text-sm text-ink-soft">
          {results.length} {results.length === 1 ? "result" : "results"} for
          &ldquo;{q}&rdquo;
        </p>
      ) : (
        <p className="text-sm text-ink-soft">
          Start typing to search the catalog.
        </p>
      )}

      {q ? (
        <ProductGrid
          products={results}
          emptyMessage={`No products found for "${q}".`}
        />
      ) : null}
    </Container>
  );
}
