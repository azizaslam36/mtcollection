/**
 * Real M&T Collection seed data.
 *
 * This intentionally MIRRORS the frontend's
 * src/data/products/real-products.ts and src/data/categories/real-categories.ts
 * rather than importing them directly — the frontend project and this
 * backend are separate TypeScript projects (different tsconfig,
 * different module system), so a direct cross-project import would
 * require extra build tooling for little benefit at this scale.
 *
 * IMPORTANT: if the frontend's real product/category data changes,
 * update this file to match before re-running the seed script.
 */

export const realCategorySeed = {
  name: "Fashion",
  slug: "fashion",
  description:
    "T-shirts, sweaters and sweatshirts curated from trusted platforms.",
  image: "/images/products/black-beige-high-neck-tshirt.jpg",
  active: true,
  featured: true,
};

export const realProductSeeds = [
  {
    slug: "black-beige-high-neck-tshirt",
    title: "Men Printed High Neck Cotton Blend Black, Beige T-Shirt",
    description: "High neck cotton blend T-shirt in a black and beige print.",
    images: ["/images/products/black-beige-high-neck-tshirt.jpg"],
    price: 389,
    platform: "Flipkart",
    affiliateUrl: "https://fktr.in/DmCtg0J",
    tags: ["tshirt", "men", "high-neck", "cotton-blend"],
  },
  {
    slug: "brown-high-neck-sweater",
    title: "Men Striped High Neck Brown Sweater",
    description: "Striped high neck sweater in brown.",
    images: ["/images/products/brown-high-neck-sweater.jpg"],
    price: 729,
    platform: "Flipkart",
    affiliateUrl: "https://fktr.in/22EjgY5",
    tags: ["sweater", "men", "high-neck", "winter"],
    season: "Winter",
  },
  {
    slug: "blue-high-neck-sweater",
    title: "Men Self Design High Neck Blue Sweater",
    description: "Self-design high neck sweater in blue.",
    images: ["/images/products/blue-high-neck-sweater.jpg"],
    price: 729,
    platform: "Flipkart",
    affiliateUrl: "https://fktr.in/dZuf181",
    tags: ["sweater", "men", "high-neck", "winter"],
    season: "Winter",
  },
  {
    slug: "typography-panelled-sweatshirt",
    title: "Typography Printed Panelled Sweatshirt",
    description: "Typography printed panelled sweatshirt.",
    images: ["/images/products/typography-panelled-sweatshirt.jpg"],
    price: 449,
    platform: "Myntra",
    affiliateUrl: "https://myntr.it/w37mGVJ",
    tags: ["sweatshirt", "men", "typography"],
  },
  {
    slug: "beige-polo-tshirt",
    title: "Men Printed Polo Neck Cotton Blend Beige T-Shirt",
    description: "Printed polo neck cotton blend T-shirt in beige.",
    images: ["/images/products/beige-polo-tshirt.jpg"],
    price: 413,
    platform: "Flipkart",
    affiliateUrl: "https://fktr.in/zGwq138",
    tags: ["tshirt", "men", "polo", "cotton-blend"],
  },
  {
    slug: "black-full-sleeve-sweatshirt",
    title: "Men Full Sleeve Solid Sweatshirt",
    description: "Full sleeve solid sweatshirt in black.",
    images: ["/images/products/black-full-sleeve-sweatshirt.jpg"],
    price: 450,
    platform: "Flipkart",
    affiliateUrl: "https://fktr.in/e7j1ZiE",
    tags: ["sweatshirt", "men", "full-sleeve"],
  },
  {
    slug: "green-polo-tshirt",
    title: "Men Printed Polo Neck Cotton Blend Green T-Shirt",
    description: "Printed polo neck cotton blend T-shirt in green.",
    images: ["/images/products/green-polo-tshirt.jpg"],
    price: 398,
    platform: "Flipkart",
    affiliateUrl: "https://fktr.in/fpB1dhN",
    tags: ["tshirt", "men", "polo", "cotton-blend"],
  },
  {
    slug: "happy-khajana-polo-tshirt",
    title: "HAPPY KHAJANA Men Polo Collar T-shirt",
    description: "Polo collar T-shirt from HAPPY KHAJANA.",
    images: ["/images/products/happy-khajana-polo-tshirt.jpg"],
    price: 349,
    platform: "Myntra",
    affiliateUrl: "https://myntr.it/MiulKw2",
    tags: ["tshirt", "men", "polo"],
  },
  {
    slug: "james-and-george-tshirt",
    title: "JAMES&GEORGE",
    description: "T-shirt from JAMES&GEORGE.",
    images: ["/images/products/james-and-george-tshirt.jpg"],
    price: 349,
    platform: "Myntra",
    affiliateUrl: "https://myntr.it/DTfDADc",
    tags: ["tshirt", "men"],
  },
  {
    slug: "ribbed-collar-casual-shirt",
    title: "Men Regular, Super Slim Fit Printed Ribbed Collar Casual Shirt",
    description: "Regular, super slim fit printed shirt with a ribbed collar.",
    images: ["/images/products/ribbed-collar-casual-shirt.jpg"],
    price: 279,
    platform: "Flipkart",
    affiliateUrl: "https://fktr.in/E40jKZ6",
    tags: ["shirt", "men", "casual", "slim-fit"],
  },
  {
    // NOTE: same title/price/image as "typography-panelled-sweatshirt"
    // above but a genuinely different affiliate link — carried over
    // from the frontend data verbatim. Documented here as it was in
    // src/data/products/real-products.ts. Worth confirming with the
    // client whether this is really two listings or one duplicated
    // by mistake.
    slug: "typography-panelled-sweatshirt-2",
    title: "Typography Printed Panelled Sweatshirt",
    description: "Typography printed panelled sweatshirt.",
    images: ["/images/products/typography-panelled-sweatshirt.jpg"],
    price: 449,
    platform: "Flipkart",
    affiliateUrl: "https://fktr.in/cOTuoum",
    tags: ["sweatshirt", "men", "typography"],
  },
] as const;
