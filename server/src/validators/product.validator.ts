import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Meesho", "Other"] as const;
const SEASONS = ["Summer", "Winter", "Monsoon", "Festive", "All Season"] as const;

const objectIdPattern = /^[a-f\d]{24}$/i;

/** Mongoose validates the URL scheme too; this catches obviously bad
 *  input earlier, with a friendlier message, before it reaches the DB. */
const affiliateUrlSchema = z
  .string()
  .trim()
  .url("affiliateUrl must be a valid URL, e.g. https://fktr.in/abc123");

export const createProductSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(slugPattern, "Slug must be lowercase kebab-case.")
      .optional(),
    description: z.string().trim().min(1, "Description is required."),
    shortDescription: z.string().trim().optional(),
    images: z.array(z.string().trim().min(1)).min(1, "At least one image is required."),
    price: z.number().nonnegative("Price cannot be negative."),
    originalPrice: z.number().nonnegative("Original price cannot be negative.").optional(),
    category: z.string().regex(objectIdPattern, "category must be a valid category id."),
    season: z.enum(SEASONS).optional(),
    platform: z.enum(PLATFORMS),
    brand: z.string().trim().optional(),
    affiliateUrl: affiliateUrlSchema,
    tags: z.array(z.string().trim()).optional(),
    priority: z.number().optional(),
    featured: z.boolean().optional(),
    trending: z.boolean().optional(),
    active: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
    reviewCount: z.number().nonnegative().optional(),
    seoTitle: z.string().trim().optional(),
    seoDescription: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.originalPrice === undefined || data.originalPrice >= data.price,
    {
      message: "originalPrice cannot be less than price.",
      path: ["originalPrice"],
    }
  );

export const updateProductSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    slug: z.string().trim().toLowerCase().regex(slugPattern).optional(),
    description: z.string().trim().min(1).optional(),
    shortDescription: z.string().trim().optional(),
    images: z.array(z.string().trim().min(1)).min(1).optional(),
    price: z.number().nonnegative().optional(),
    originalPrice: z.number().nonnegative().optional(),
    category: z.string().regex(objectIdPattern).optional(),
    season: z.enum(SEASONS).optional(),
    platform: z.enum(PLATFORMS).optional(),
    brand: z.string().trim().optional(),
    affiliateUrl: affiliateUrlSchema.optional(),
    tags: z.array(z.string().trim()).optional(),
    priority: z.number().optional(),
    featured: z.boolean().optional(),
    trending: z.boolean().optional(),
    active: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
    reviewCount: z.number().nonnegative().optional(),
    seoTitle: z.string().trim().optional(),
    seoDescription: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.originalPrice === undefined ||
      data.price === undefined ||
      data.originalPrice >= data.price,
    {
      message: "originalPrice cannot be less than price.",
      path: ["originalPrice"],
    }
  );

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(48).default(12),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  trending: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  season: z.enum(SEASONS).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sort: z
    .enum(["newest", "price-low", "price-high", "discount", "featured"])
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
