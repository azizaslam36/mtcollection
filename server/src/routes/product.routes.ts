import { Router } from "express";
import {
  listProducts,
  listProductsAdmin,
  getProductBySlug,
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  setPublished,
  setFeatured,
  setTrending,
} from "../controllers/product.controller";
import { validate } from "../middleware/validate";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validators/product.validator";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// Public
router.get("/", validate(productQuerySchema, "query"), listProducts);
router.get("/:slug", getProductBySlug);

// Admin
router.get(
  "/admin/all",
  requireAdmin,
  validate(productQuerySchema, "query"),
  listProductsAdmin
);
router.get("/admin/:id", requireAdmin, getProductByIdAdmin);
router.post("/", requireAdmin, validate(createProductSchema), createProduct);
router.put("/:id", requireAdmin, validate(updateProductSchema), updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);
router.patch("/:id/publish", requireAdmin, setPublished);
router.patch("/:id/featured", requireAdmin, setFeatured);
router.patch("/:id/trending", requireAdmin, setTrending);

export default router;
