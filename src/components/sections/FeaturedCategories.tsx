import { getAllCategories, getCategoryProductCount } from "@/data/categories";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Container, SectionHeading } from "@/components/ui/Layout";

export async function FeaturedCategories() {
  const categories = await getAllCategories();

  const withCounts = await Promise.all(
    categories.map(async (cat) => ({
      cat,
      count: await getCategoryProductCount(cat.slug),
    }))
  );

  const categoriesWithStock = withCounts
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  if (categoriesWithStock.length === 0) return null;

  return (
    <section className="py-14">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Shop by category"
          title="Featured Categories"
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoriesWithStock.map(({ cat, count }) => (
            <CategoryCard key={cat.slug} category={cat} productCount={count} />
          ))}
        </div>
      </Container>
    </section>
  );
}
