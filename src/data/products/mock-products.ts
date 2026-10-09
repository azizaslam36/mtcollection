import type { Product } from "@/types/product";

/**
 * MOCK / DEMO products — for UI development and testing ONLY.
 *
 * - Every affiliateUrl below is a placeholder (example.com). None of
 *   these are real affiliate links.
 * - Every price, discount, rating and reviewCount is fabricated to
 *   exercise the UI (cards, filters, sorting, product detail pages).
 *   None of it should ever be presented to a real user as real data.
 * - Images are loaded from placehold.co, not real product photos.
 * - Every entry has isDemo: true so it can never be confused with
 *   real M&T Collection data in the data model.
 *
 * Set NEXT_PUBLIC_SHOW_DEMO_DATA=false (see .env.example) to remove
 * all of this from the site before production / client delivery —
 * no code changes required.
 */
export const mockProducts: Product[] = [
  {
    id: "demo-01",
    slug: "demo-wireless-earbuds",
    title: "[Demo] Wireless Earbuds",
    description: "Placeholder demo product used to test the Electronics category and product filters.",
    image: "https://placehold.co/600x600?text=Demo+Product",
    price: 1999,
    originalPrice: 2999,
    category: "Electronics",
    categorySlug: "electronics",
    season: "All Season",
    rating: 4.2,
    reviewCount: 128,
    featured: true,
    trending: true,
    affiliateUrl: "https://example.com/demo-affiliate-link-1",
    platform: "Other",
    tags: ["demo", "electronics", "audio"],
    isDemo: true,
  },
  {
    id: "demo-02",
    slug: "demo-smart-watch",
    title: "[Demo] Smart Watch",
    description: "Placeholder demo product used to test price-range filtering.",
    image: "https://placehold.co/600x600?text=Demo+Product",
    price: 3499,
    originalPrice: 4999,
    category: "Electronics",
    categorySlug: "electronics",
    season: "All Season",
    rating: 4.5,
    reviewCount: 342,
    trending: true,
    affiliateUrl: "https://example.com/demo-affiliate-link-2",
    platform: "Other",
    tags: ["demo", "electronics", "wearable"],
    isDemo: true,
  },
  {
    id: "demo-03",
    slug: "demo-ceramic-mug-set",
    title: "[Demo] Ceramic Mug Set",
    description: "Placeholder demo product used to test the Home category.",
    image: "https://placehold.co/600x600?text=Demo+Product",
    price: 599,
    category: "Home",
    categorySlug: "home",
    season: "All Season",
    rating: 4.0,
    reviewCount: 56,
    affiliateUrl: "https://example.com/demo-affiliate-link-3",
    platform: "Other",
    tags: ["demo", "home", "kitchen"],
    isDemo: true,
  },
  {
    id: "demo-04",
    slug: "demo-scented-candle-set",
    title: "[Demo] Scented Candle Set",
    description: "Placeholder demo product used to test seasonal (Festive) filtering.",
    image: "https://placehold.co/600x600?text=Demo+Product",
    price: 799,
    originalPrice: 999,
    category: "Home",
    categorySlug: "home",
    season: "Festive",
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    affiliateUrl: "https://example.com/demo-affiliate-link-4",
    platform: "Other",
    tags: ["demo", "home", "festive", "gifting"],
    isDemo: true,
  },
  {
    id: "demo-05",
    slug: "demo-face-serum",
    title: "[Demo] Vitamin C Face Serum",
    description: "Placeholder demo product used to test the Beauty category and an empty-category fallback if removed.",
    image: "https://placehold.co/600x600?text=Demo+Product",
    price: 449,
    category: "Beauty",
    categorySlug: "beauty",
    season: "Summer",
    rating: 4.3,
    reviewCount: 210,
    trending: true,
    affiliateUrl: "https://example.com/demo-affiliate-link-5",
    platform: "Other",
    tags: ["demo", "beauty", "skincare"],
    isDemo: true,
  },
  {
    id: "demo-06",
    slug: "demo-rain-jacket",
    title: "[Demo] Packable Rain Jacket",
    description: "Placeholder demo product used to test Monsoon season filtering.",
    image: "https://placehold.co/600x600?text=Demo+Product",
    price: 1299,
    originalPrice: 1799,
    category: "Fashion",
    categorySlug: "fashion",
    season: "Monsoon",
    rating: 4.1,
    reviewCount: 34,
    affiliateUrl: "https://example.com/demo-affiliate-link-6",
    platform: "Other",
    tags: ["demo", "fashion", "monsoon"],
    isDemo: true,
  },
];
