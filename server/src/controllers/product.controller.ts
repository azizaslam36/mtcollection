import type { FilterQuery } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendPaginated } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { Product, type ProductDocument } from "../models/Product";
import { Category } from "../models/Category";
import { slugify } from "../utils/slugify";
import { env } from "../config/env";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQueryInput,
} from "../validators/product.validator";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  "price-low": { price: 1 },
  "price-high": { price: -1 },
  discount: { discount: -1 },
  featured: { featured: -1, createdAt: -1 },
};

/** Base filter every PUBLIC query must include — active only, and
 *  demo data excluded unless explicitly enabled for a non-production
 *  environment (env.showDemoData already hard-disables in prod). */
function publicBaseFilter(): FilterQuery<ProductDocument> {
  const filter: FilterQuery<ProductDocument> = { active: true };
  if (!env.showDemoData) {
    filter.isDemo = { $ne: true };
  }
  return filter;
}

export const listProducts = asyncHandler(async (req, res) => {
  const query = req.query as unknown as ProductQueryInput;
  const filter = publicBaseFilter();

  if (query.category) {
    const category = await Category.findOne({ slug: query.category, active: true });
    if (!category) {
      return sendPaginated(res, [], {
        page: query.page,
        limit: query.limit,
        total: 0,
        totalPages: 0,
      });
    }
    filter.category = category._id;
  }

  if (query.featured !== undefined) filter.featured = query.featured;
  if (query.trending !== undefined) filter.trending = query.trending;
  if (query.season) filter.season = query.season;

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
    if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sort = SORT_MAP[query.sort ?? "newest"];
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(query.limit),
    Product.countDocuments(filter),
  ]);

  return sendPaginated(res, items, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit) || 1,
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    ...publicBaseFilter(),
  }).populate("category", "name slug");

  if (!product) throw ApiError.notFound("Product not found.");
  return sendSuccess(res, product);
});

/** Admin: all products regardless of active/demo state, with the
 *  same filter/pagination shape as the public endpoint. */
export const listProductsAdmin = asyncHandler(async (req, res) => {
  const query = req.query as unknown as ProductQueryInput;
  const filter: FilterQuery<ProductDocument> = {};

  if (query.category) filter.category = query.category;
  if (query.featured !== undefined) filter.featured = query.featured;
  if (query.trending !== undefined) filter.trending = query.trending;
  if (query.active !== undefined) filter.active = query.active;
  if (query.search) filter.$text = { $search: query.search };

  const sort = SORT_MAP[query.sort ?? "newest"];
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(query.limit),
    Product.countDocuments(filter),
  ]);

  return sendPaginated(res, items, {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit) || 1,
  });
});

export const getProductByIdAdmin = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name slug");
  if (!product) throw ApiError.notFound("Product not found.");
  return sendSuccess(res, product);
});

async function assertCategoryExists(categoryId: string) {
  const category = await Category.findById(categoryId);
  if (!category) throw ApiError.badRequest("category must reference an existing category.");
}

export const createProduct = asyncHandler(async (req, res) => {
  const input = req.body as CreateProductInput;
  await assertCategoryExists(input.category);

  const slug = input.slug || slugify(input.title);
  const existing = await Product.findOne({ slug });
  if (existing) {
    throw ApiError.conflict(`A product with slug "${slug}" already exists.`);
  }

  const product = await Product.create({ ...input, slug });
  return sendSuccess(res, product, "Product created.", 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const input = req.body as UpdateProductInput;

  if (input.category) {
    await assertCategoryExists(input.category);
  }

  if (input.slug) {
    const existing = await Product.findOne({
      slug: input.slug,
      _id: { $ne: req.params.id },
    });
    if (existing) {
      throw ApiError.conflict(`A product with slug "${input.slug}" already exists.`);
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });
  if (!product) throw ApiError.notFound("Product not found.");
  return sendSuccess(res, product, "Product updated.");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw ApiError.notFound("Product not found.");
  return sendSuccess(res, null, "Product deleted.");
});

function makeToggleHandler(field: "active" | "featured" | "trending") {
  return asyncHandler(async (req, res) => {
    const value = Boolean(req.body?.value);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { [field]: value },
      { new: true }
    );
    if (!product) throw ApiError.notFound("Product not found.");
    return sendSuccess(res, product, `Product ${field} updated.`);
  });
}

export const setPublished = makeToggleHandler("active");
export const setFeatured = makeToggleHandler("featured");
export const setTrending = makeToggleHandler("trending");
