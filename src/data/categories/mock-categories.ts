import type { Category } from "@/types/category";

/**
 * MOCK / DEMO categories — for UI development and testing ONLY.
 * Exist so the category grid, filters, and (importantly) the empty
 * category state can be demonstrated with more variety than the
 * current real catalog (a single "Fashion" category) provides.
 *
 * Set NEXT_PUBLIC_SHOW_DEMO_DATA=false (see .env.example) to remove
 * these from the site before production / client delivery.
 */
export const mockCategories: Category[] = [
  {
    id: "cat-demo-electronics",
    slug: "electronics",
    name: "Electronics",
    description: "Placeholder demo category — gadgets and accessories.",
    image: "https://placehold.co/600x400?text=Electronics",
    isDemo: true,
  },
  {
    id: "cat-demo-home",
    slug: "home",
    name: "Home",
    description: "Placeholder demo category — home and kitchen items.",
    image: "https://placehold.co/600x400?text=Home",
    isDemo: true,
  },
  {
    id: "cat-demo-beauty",
    slug: "beauty",
    name: "Beauty",
    description: "Placeholder demo category — skincare and personal care.",
    image: "https://placehold.co/600x400?text=Beauty",
    isDemo: true,
  },
  {
    id: "cat-demo-empty",
    slug: "accessories",
    name: "Accessories",
    description:
      "Placeholder demo category with NO products in it, used to build and verify the category empty state.",
    image: "https://placehold.co/600x400?text=Accessories",
    isDemo: true,
  },
];
