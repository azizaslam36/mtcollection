import { Schema, model, models, type Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  active: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: { type: String, required: true, trim: true },
    image: { type: String },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// `unique: true` above already creates this index; declared again
// explicitly here so the "prevent duplicate slugs" requirement is
// visible at a glance without having to know Mongoose's shorthand.
categorySchema.index({ slug: 1 }, { unique: true });

// Reuse the existing compiled model on hot-reload (tsx watch) instead
// of throwing "Cannot overwrite model" on every file change.
export const Category =
  models.Category || model<CategoryDocument>("Category", categorySchema);
