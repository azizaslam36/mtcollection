import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { loginSchema } from "../validators/auth.validator";
import { requireAdmin } from "../middleware/auth";
import { loginRateLimiter } from "../middleware/rateLimit";

const router = Router();

router.post("/login", loginRateLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAdmin, me);

export default router;
