import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";
import { Container } from "@/components/ui/Layout";
import { Skeleton } from "@/components/ui/Skeleton";

// Route-level fallback shown by Next.js while a page segment loads.
// With local data this resolves near-instantly, but this is what
// will actually be visible once the data layer is swapped for a real
// API in a later stage (per the plan's Stage 3 boundary).
export default function Loading() {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <Skeleton className="h-9 w-64" />
      <ProductGridSkeleton count={8} />
    </Container>
  );
}
