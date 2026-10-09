import { Tag } from "@/components/ui/Tag";
import { calculateDiscountPercent } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductBadge({ product }: { product: Product }) {
  const discount = calculateDiscountPercent(product.price, product.originalPrice);

  if (!discount) return null;

  return <Tag tone="marigold">{discount}% off</Tag>;
}

export function PlatformBadge({ platform }: { platform: Product["platform"] }) {
  return (
    <span className="rounded-tag bg-paper/90 px-2 py-1 text-[11px] font-medium text-ink-soft backdrop-blur-sm">
      {platform}
    </span>
  );
}
