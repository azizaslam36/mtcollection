import { formatPrice } from "@/lib/utils";

export function ProductPrice({
  price,
  originalPrice,
  size = "md",
}: {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
}) {
  const priceSize =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <div className="flex items-baseline gap-2 font-sans tabular-nums">
      <span className={`${priceSize} font-semibold text-ink`}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price ? (
        <span className="text-sm text-ink-soft line-through">
          {formatPrice(originalPrice)}
        </span>
      ) : null}
    </div>
  );
}
