import type { Product } from "@/types/product";

/**
 * REAL M&T Collection products, migrated from the old static site
 * (index.html / products.html). Every price, image and affiliateUrl
 * here is real business data — do not edit casually, and never mix
 * mock data into this file (see mock-products.ts for that).
 *
 * KNOWN DATA ISSUE FOUND DURING MIGRATION (documented, not silently
 * fixed): the old site listed TWO products with the identical title
 * "Men Printed Polo Neck Cotton Blend Green T-Shirt", the same price
 * (398) and the same affiliate link (fktr.in/fpB1dhN), but two
 * different product photos (california.jpeg and blackjacket2.jpeg).
 * That looks like a copy/paste duplicate rather than two real
 * listings. Only one entry (green-polo-tshirt, using california.jpeg)
 * has been kept below. Flag this to the client — if blackjacket2.jpeg
 * was actually meant to be a distinct product, it needs a real,
 * distinct affiliate link before it can be re-added.
 *
 * Also note: "typography-panelled-sweatshirt" appears twice below
 * with the same title/price/image but two different affiliate links
 * (w37mGVJ and cOTuoum). Unlike the case above, the links genuinely
 * differ, so both have been preserved as-is — but this is worth
 * confirming with the client too.
 */
export const realProducts: Product[] = [
  {
    id: "real-01",
    slug: "black-beige-high-neck-tshirt",
    title: "Men Printed High Neck Cotton Blend Black, Beige T-Shirt",
    description:
      "High neck cotton blend T-shirt in a black and beige print.",
    image: "/images/products/black-beige-high-neck-tshirt.jpg",
    price: 389,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://fktr.in/DmCtg0J",
    platform: "Flipkart",
    tags: ["tshirt", "men", "high-neck", "cotton-blend"],
    isDemo: false,
  },
  {
    id: "real-02",
    slug: "brown-high-neck-sweater",
    title: "Men Striped High Neck Brown Sweater",
    description: "Striped high neck sweater in brown.",
    image: "/images/products/brown-high-neck-sweater.jpg",
    price: 729,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://fktr.in/22EjgY5",
    platform: "Flipkart",
    tags: ["sweater", "men", "high-neck", "winter"],
    season: "Winter",
    isDemo: false,
  },
  {
    id: "real-03",
    slug: "blue-high-neck-sweater",
    title: "Men Self Design High Neck Blue Sweater",
    description: "Self-design high neck sweater in blue.",
    image: "/images/products/blue-high-neck-sweater.jpg",
    price: 729,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://fktr.in/dZuf181",
    platform: "Flipkart",
    tags: ["sweater", "men", "high-neck", "winter"],
    season: "Winter",
    isDemo: false,
  },
  {
    id: "real-04",
    slug: "typography-panelled-sweatshirt",
    title: "Typography Printed Panelled Sweatshirt",
    description: "Typography printed panelled sweatshirt.",
    image: "/images/products/typography-panelled-sweatshirt.jpg",
    price: 449,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://myntr.it/w37mGVJ",
    platform: "Myntra",
    tags: ["sweatshirt", "men", "typography"],
    isDemo: false,
  },
  {
    id: "real-05",
    slug: "beige-polo-tshirt",
    title: "Men Printed Polo Neck Cotton Blend Beige T-Shirt",
    description: "Printed polo neck cotton blend T-shirt in beige.",
    image: "/images/products/beige-polo-tshirt.jpg",
    price: 413,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://fktr.in/zGwq138",
    platform: "Flipkart",
    tags: ["tshirt", "men", "polo", "cotton-blend"],
    isDemo: false,
  },
  {
    id: "real-06",
    slug: "black-full-sleeve-sweatshirt",
    title: "Men Full Sleeve Solid Sweatshirt",
    description: "Full sleeve solid sweatshirt in black.",
    image: "/images/products/black-full-sleeve-sweatshirt.jpg",
    price: 450,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://fktr.in/e7j1ZiE",
    platform: "Flipkart",
    tags: ["sweatshirt", "men", "full-sleeve"],
    isDemo: false,
  },
  {
    id: "real-07",
    slug: "green-polo-tshirt",
    title: "Men Printed Polo Neck Cotton Blend Green T-Shirt",
    description: "Printed polo neck cotton blend T-shirt in green.",
    image: "/images/products/green-polo-tshirt.jpg",
    price: 398,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://fktr.in/fpB1dhN",
    platform: "Flipkart",
    tags: ["tshirt", "men", "polo", "cotton-blend"],
    isDemo: false,
  },
  {
    id: "real-08",
    slug: "happy-khajana-polo-tshirt",
    title: "HAPPY KHAJANA Men Polo Collar T-shirt",
    description: "Polo collar T-shirt from HAPPY KHAJANA.",
    image: "/images/products/happy-khajana-polo-tshirt.jpg",
    price: 349,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://myntr.it/MiulKw2",
    platform: "Myntra",
    tags: ["tshirt", "men", "polo"],
    isDemo: false,
  },
  {
    id: "real-09",
    slug: "james-and-george-tshirt",
    title: "JAMES&GEORGE",
    description: "T-shirt from JAMES&GEORGE.",
    image: "/images/products/james-and-george-tshirt.jpg",
    price: 349,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://myntr.it/DTfDADc",
    platform: "Myntra",
    tags: ["tshirt", "men"],
    isDemo: false,
  },
  {
    id: "real-10",
    slug: "ribbed-collar-casual-shirt",
    title: "Men Regular, Super Slim Fit Printed Ribbed Collar Casual Shirt",
    description:
      "Regular, super slim fit printed shirt with a ribbed collar.",
    image: "/images/products/ribbed-collar-casual-shirt.jpg",
    price: 279,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://fktr.in/E40jKZ6",
    platform: "Flipkart",
    tags: ["shirt", "men", "casual", "slim-fit"],
    isDemo: false,
  },
  {
    id: "real-11",
    slug: "typography-panelled-sweatshirt-2",
    title: "Typography Printed Panelled Sweatshirt",
    description: "Typography printed panelled sweatshirt.",
    image: "/images/products/typography-panelled-sweatshirt.jpg",
    price: 449,
    category: "Fashion",
    categorySlug: "fashion",
    affiliateUrl: "https://fktr.in/cOTuoum",
    platform: "Flipkart",
    tags: ["sweatshirt", "men", "typography"],
    isDemo: false,
  },
];
