import { getFeaturedProducts } from "@/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container, SectionHeading } from "@/components/ui/Layout";

export async function FeaturedDeals() {
  const featured = (await getFeaturedProducts()).slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <section className="bg-white py-14">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="Hand-picked" title="Featured Deals" />
        <ProductGrid products={featured} />
      </Container>
    </section>
  );
}
