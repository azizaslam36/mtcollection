import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { ProductPrice } from "./ProductPrice";
import { ProductBadge, PlatformBadge } from "./ProductBadge";
import { Tag } from "@/components/ui/Tag";
import type { Product } from "@/types/product";

/**
 * Card is a server component — hover zoom/lift is done with plain CSS
 * (group-hover) rather than Framer Motion, since no interactivity
 * beyond CSS is actually needed here. Keeps the product grid cheap to
 * render server-side.
 */
export function ProductCard({ product }: { product: Product }) {
  const isExternalImage = product.image.startsWith("http");

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-card border border-mist bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-mist"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          unoptimized={isExternalImage}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          <ProductBadge product={product} />
          {product.isDemo ? <Tag tone="ink">Demo</Tag> : null}
        </div>
        <div className="absolute right-3 top-3">
          <PlatformBadge platform={product.platform} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          {product.category}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-sans font-medium text-ink hover:text-marigold-dark">
            {product.title}
          </h3>
        </Link>

        {product.rating ? (
          <div className="flex items-center gap-1 text-xs text-ink-soft">
            <Star className="h-3.5 w-3.5 fill-marigold text-marigold" />
            <span>{product.rating.toFixed(1)}</span>
            {product.reviewCount ? (
              <span>({product.reviewCount})</span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-2">
          <ProductPrice
            price={product.price}
            originalPrice={product.originalPrice}
          />
        </div>

        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="mt-1 inline-flex items-center justify-center rounded-tag bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-marigold hover:text-ink"
        >
          Check Deal
        </a>
      </div>
    </div>
  );
}
