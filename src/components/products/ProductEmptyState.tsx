import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

export function ProductEmptyState({
  message = "No products match these filters.",
  showClearLink = true,
}: {
  message?: string;
  showClearLink?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-mist bg-white px-6 py-16 text-center">
      <PackageSearch className="h-10 w-10 text-ink-soft" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="font-sans font-medium text-ink">{message}</p>
        <p className="text-sm text-ink-soft">
          Try a different category, season, or price range.
        </p>
      </div>
      {showClearLink ? (
        <Link href="/products" className={buttonClasses("secondary", "sm")}>
          Clear filters
        </Link>
      ) : null}
    </div>
  );
}
