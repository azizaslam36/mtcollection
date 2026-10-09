import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely, resolving conflicting utility
 * classes (e.g. "px-2" vs "px-4") in favor of the later one.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian Rupees, e.g. 389 -> "₹389".
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculate a discount percentage from an original and current price.
 * Returns undefined when there's no meaningful discount, so callers
 * can decide not to render a discount badge at all rather than
 * showing "0% off".
 */
export function calculateDiscountPercent(
  price: number,
  originalPrice?: number
): number | undefined {
  if (!originalPrice || originalPrice <= price) return undefined;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
