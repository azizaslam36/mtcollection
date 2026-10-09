import { Schema, model, models, type Document, type Types } from "mongoose";

export type Platform = "Amazon" | "Flipkart" | "Myntra" | "Meesho" | "Other";
export type Season = "Summer" | "Winter" | "Monsoon" | "Festive" | "All Season";

export interface ProductDocument extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  /** Stored, not just derived, so it can be sorted/filtered on
   *  directly in MongoDB queries — but always recalculated server-side
   *  from price/originalPrice on save rather than trusted from admin
   *  input (see pre-save hook below). */
  discount?: number;
  category: Types.ObjectId;
  season?: Season;
  platform: Platform;
  brand?: string;
  affiliateUrl: string;
  /** Present only for products imported via the affiliate metadata
   *  service (see services/affiliate). Manually-entered products
   *  leave these undefined. */
  sourceProductId?: string;
  externalProductUrl?: string;
  importedAt?: Date;
  tags: string[];
  priority: number;
  featured: boolean;
  trending: boolean;
  /** Published/active flag. Only published+active products are ever
   *  returned by public GET endpoints (see product.controller.ts). */
  active: boolean;
  /** Mirrors the Stage 1/2 frontend's isDemo concept (see
   *  src/data/products/*.ts). Kept so demo/seed data can be told
   *  apart from real admin-entered data even inside one database,
   *  and excluded from the public API when NODE_ENV=production and
   *  demo data hasn't been explicitly enabled — see product.controller.ts. */
  isDemo: boolean;
  rating?: number;
  reviewCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one product image is required.",
      },
    },
    price: { type: Number, required: true, min: 0 },
    originalPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (this: ProductDocument, value: number) {
          return value === undefined || value === null || value >= this.price;
        },
        message: "originalPrice cannot be less than price.",
      },
    },
    discount: { type: Number, min: 0, max: 100 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    season: {
      type: String,
      enum: ["Summer", "Winter", "Monsoon", "Festive", "All Season"],
    },
    platform: {
      type: String,
      enum: ["Amazon", "Flipkart", "Myntra", "Meesho", "Other"],
      required: true,
    },
    brand: { type: String, trim: true },
    affiliateUrl: {
      type: String,
      required: true,
      validate: {
        validator: (value: string) => {
          try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
          } catch {
            return false;
          }
        },
        message: "affiliateUrl must be a valid http(s) URL.",
      },
    },
    sourceProductId: { type: String },
    externalProductUrl: { type: String },
    importedAt: { type: Date },
    tags: { type: [String], default: [] },
    priority: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    isDemo: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, min: 0 },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, active: 1 });
productSchema.index({ featured: 1, active: 1 });
productSchema.index({ trending: 1, active: 1 });
productSchema.index({ title: "text", description: "text", tags: "text" });

/**
 * Always derive `discount` from price/originalPrice on save rather
 * than trusting a manually-entered value — avoids the exact
 * inconsistent-discount problem the Stage 3 spec calls out (#16).
 */
productSchema.pre("save", function (this: ProductDocument, next: () => void) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  } else {
    this.discount = undefined;
  }
  next();
});

export const Product =
  models.Product || model<ProductDocument>("Product", productSchema);
