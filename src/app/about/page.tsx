import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/Layout";
import { ShieldCheck, Tags, Store } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "M&T Collection is an affiliate product discovery platform surfacing curated fashion deals from trusted platforms.",
};

export default function AboutPage() {
  return (
    <Container className="flex flex-col gap-12 py-14">
      <SectionHeading
        eyebrow="About us"
        title="What M&T Collection is"
        description="A straightforward explanation of how this platform works — no invented history or numbers, just what's actually true today."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-card border border-mist bg-white p-6">
          <ShieldCheck className="h-6 w-6 text-marigold-dark" aria-hidden="true" />
          <h3 className="font-sans font-semibold">Affiliate discovery</h3>
          <p className="text-sm text-ink-soft">
            We surface products from established platforms — Flipkart and
            Myntra today — and link you directly to them to complete your
            purchase.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-card border border-mist bg-white p-6">
          <Tags className="h-6 w-6 text-marigold-dark" aria-hidden="true" />
          <h3 className="font-sans font-semibold">Curated, not exhaustive</h3>
          <p className="text-sm text-ink-soft">
            Every product on this site was picked individually, rather than
            imported in bulk from a catalog feed.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-card border border-mist bg-white p-6">
          <Store className="h-6 w-6 text-marigold-dark" aria-hidden="true" />
          <h3 className="font-sans font-semibold">Self-branded, too</h3>
          <p className="text-sm text-ink-soft">
            Alongside affiliate links, M&amp;T Collection also offers a small
            number of self-branded products.
          </p>
        </div>
      </div>

      <div className="max-w-2xl text-ink-soft">
        <p>
          When you tap &ldquo;Check Deal&rdquo; on a product, you&apos;ll be
          taken to the merchant&apos;s own site to view current pricing and
          complete checkout there. M&amp;T Collection doesn&apos;t process
          payments or handle order fulfillment directly for affiliate
          products.
        </p>
      </div>
    </Container>
  );
}
