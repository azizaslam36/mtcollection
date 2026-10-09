import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { Category } from "../models/Category";
import { Product } from "../models/Product";
import { slugify } from "../utils/slugify";
import type { CreateCategoryInput, UpdateCategoryInput } from "../validators/category.validator";

/** Public: only active categories. */
export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ active: true }).sort({ name: 1 });
  return sendSuccess(res, categories);
});

/** Admin: every category regardless of active state. */
export const listAllCategoriesAdmin = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  return sendSuccess(res, categories);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, active: true });
  if (!category) throw ApiError.notFound("Category not found.");
  return sendSuccess(res, category);
});

export const getCategoryByIdAdmin = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound("Category not found.");
  return sendSuccess(res, category);
});

export const createCategory = asyncHandler(async (req, res) => {
  const input = req.body as CreateCategoryInput;
  const slug = input.slug || slugify(input.name);

  const existing = await Category.findOne({ slug });
  if (existing) {
    throw ApiError.conflict(`A category with slug "${slug}" already exists.`);
  }

  const category = await Category.create({ ...input, slug });
  return sendSuccess(res, category, "Category created.", 201);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const input = req.body as UpdateCategoryInput;

  if (input.slug) {
    const existing = await Category.findOne({
      slug: input.slug,
      _id: { $ne: req.params.id },
    });
    if (existing) {
      throw ApiError.conflict(`A category with slug "${input.slug}" already exists.`);
    }
  }

  const category = await Category.findByIdAndUpdate(req.params.id, input, {
    new: true,
    runValidators: true,
  });
  if (!category) throw ApiError.notFound("Category not found.");
  return sendSuccess(res, category, "Category updated.");
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    throw ApiError.conflict(
      `Cannot delete this category — ${productCount} product(s) still reference it. Deactivate it instead, or move those products first.`
    );
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw ApiError.notFound("Category not found.");
  return sendSuccess(res, null, "Category deleted.");
});
