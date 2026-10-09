import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";

export function FinalCta() {
  return (
    <section className="bg-ink py-16 text-paper">
      <Container className="flex flex-col items-center gap-5 text-center">
        <h2 className="text-3xl sm:text-4xl">Ready to find your next pick?</h2>
        <p className="max-w-md text-paper/70">
          Browse the full catalog and filter by category, season, or price.
        </p>
        <Link href="/products" className={buttonClasses("primary", "lg")}>
          Browse All Products
        </Link>
      </Container>
    </section>
  );
}
