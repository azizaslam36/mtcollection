import type { Category } from "@/types/category";

/**
 * REAL categories, backed by actual M&T Collection products.
 *
 * The old site only ever had one real category ("Tshirt", covering
 * T-shirts, sweaters and sweatshirts). Per the approved plan, we are
 * NOT inventing extra real categories just to fill out the UI — so
 * this list is intentionally short. See mock-categories.ts for demo
 * categories used to exercise the category grid / filters / empty
 * states during development.
 */
export const realCategories: Category[] = [
  {
    id: "cat-real-fashion",
    slug: "fashion",
    name: "Fashion",
    description:
      "T-shirts, sweaters and sweatshirts curated from trusted platforms.",
    image: "/images/products/black-beige-high-neck-tshirt.jpg",
    isDemo: false,
  },
];
