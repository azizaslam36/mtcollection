import Link from "next/link";
import { getAllProducts } from "@/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Container, SectionHeading } from "@/components/ui/Layout";
import { buttonClasses } from "@/components/ui/Button";
import type { Product, Season } from "@/types/product";

/**
 * Picks the season with the most products in the current data set,
 * rather than hardcoding "Winter" or reading the calendar — so this
 * section stays honest as the catalog changes (works the same way
 * whether the data came from the API or local files).
 */
function getDominantSeason(products: Product[]): Season | null {
  const counts = new Map<Season, number>();
  for (const p of products) {
    if (!p.season) continue;
    counts.set(p.season, (counts.get(p.season) ?? 0) + 1);
  }
  let top: Season | null = null;
  let max = 0;
  for (const [season, count] of counts) {
    if (count > max) {
      top = season;
      max = count;
    }
  }
  return top;
}

export async function SeasonalCollection() {
  const allProducts = await getAllProducts();
  const season = getDominantSeason(allProducts);
  if (!season) return null;

  const products = allProducts.filter((p) => p.season === season).slice(0, 4);
  if (products.length === 0) return null;

  return (
    <section className="py-14">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Seasonal collection"
          title={`${season} Picks`}
          description={`Products suited for ${season.toLowerCase()}, pulled from our current catalog.`}
        />
        <ProductGrid products={products} />
        <Link
          href={`/products?season=${encodeURIComponent(season)}`}
          className={buttonClasses("secondary", "md", "self-start")}
        >
          See all {season} picks
        </Link>
      </Container>
    </section>
  );
}
