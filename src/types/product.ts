export type Platform = "Amazon" | "Flipkart" | "Myntra" | "Meesho" | "Other";

export type Season = "Summer" | "Winter" | "Monsoon" | "Festive" | "All Season";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  /** Discount percentage, e.g. 20 for 20% off. Prefer deriving this
   *  from price/originalPrice via calculateDiscountPercent() rather
   *  than hand-entering it, to avoid it drifting out of sync. */
  discount?: number;
  category: string;
  categorySlug: string;
  season?: Season;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  trending?: boolean;
  affiliateUrl: string;
  platform: Platform;
  tags: string[];

  /**
   * REQUIRED data-provenance flag.
   *
   * false = a real, verified M&T Collection product with a real
   *         affiliate link, price, image, etc.
   * true  = mock/demo data that exists ONLY to develop and test the
   *         UI (search, filters, sorting, grids, empty states...).
   *         Never a real price, rating, review count or affiliate URL.
   *
   * See src/data/products/index.ts and NEXT_PUBLIC_SHOW_DEMO_DATA in
   * .env.example for how this flag is used to strip demo data before
   * production / client delivery.
   */
  isDemo: boolean;
}
