import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { AdminUser } from "../models/AdminUser";

export interface AuthedRequest extends Request {
  admin?: { id: string; email: string };
}

interface TokenPayload {
  sub: string;
  email: string;
}

/**
 * Reads the admin JWT from an httpOnly cookie (never from a header or
 * localStorage-readable location — see auth.controller.ts for why).
 * Confirms the admin user still exists on every request rather than
 * trusting the token alone, so a deleted admin is locked out
 * immediately rather than whenever the token happens to expire.
 */
export async function requireAdmin(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) {
      throw ApiError.unauthorized();
    }

    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    const admin = await AdminUser.findById(payload.sub).select("_id email");
    if (!admin) {
      throw ApiError.unauthorized();
    }

    req.admin = { id: admin.id, email: admin.email };
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired session."));
  }
}
