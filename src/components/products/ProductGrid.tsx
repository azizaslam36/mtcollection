import { ProductCard } from "./ProductCard";
import { ProductEmptyState } from "./ProductEmptyState";
import type { Product } from "@/types/product";

export function ProductGrid({
  products,
  emptyMessage,
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return <ProductEmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
