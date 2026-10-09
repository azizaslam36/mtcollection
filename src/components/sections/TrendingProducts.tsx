import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTrendingProducts } from "@/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container, SectionHeading } from "@/components/ui/Layout";

export async function TrendingProducts() {
  const trending = (await getTrendingProducts()).slice(0, 4);
  if (trending.length === 0) return null;

  return (
    <section className="bg-white py-14">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Popular right now" title="Trending Products" />
          <Link
            href="/products?sort=featured"
            className="flex items-center gap-1 text-sm font-medium text-ink hover:text-marigold-dark"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ProductGrid products={trending} />
      </Container>
    </section>
  );
}
