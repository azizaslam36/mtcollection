import { Router } from "express";
import { importAffiliateUrl } from "../controllers/affiliate.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// Admin-only — this is a tool for the product creation workflow, not
// a public feature.
router.post("/import", requireAdmin, importAffiliateUrl);

export default router;
