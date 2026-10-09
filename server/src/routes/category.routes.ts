import { Router } from "express";
import {
  listCategories,
  listAllCategoriesAdmin,
  getCategoryBySlug,
  getCategoryByIdAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { validate } from "../middleware/validate";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// Public
router.get("/", listCategories);
router.get("/:slug", getCategoryBySlug);

// Admin
router.get("/admin/all", requireAdmin, listAllCategoriesAdmin);
router.get("/admin/:id", requireAdmin, getCategoryByIdAdmin);
router.post("/", requireAdmin, validate(createCategorySchema), createCategory);
router.put("/:id", requireAdmin, validate(updateCategorySchema), updateCategory);
router.delete("/:id", requireAdmin, deleteCategory);

export default router;
