import type { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { AdminUser } from "../models/AdminUser";
import type { AuthedRequest } from "../middleware/auth";
import type { LoginInput } from "../validators/auth.validator";

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function setAuthCookie(res: Response, token: string) {
  res.cookie(env.cookieName, token, {
    httpOnly: true, // never readable from client-side JS — mitigates XSS token theft
    secure: env.isProduction, // HTTPS-only in production
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as LoginInput;

  const admin = await AdminUser.findOne({ email }).select("+passwordHash");
  // Deliberately identical error for "no such user" and "wrong
  // password" — distinguishing them lets an attacker enumerate valid
  // admin emails.
  if (!admin) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const isValid = await admin.comparePassword(password);
  if (!isValid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const token = jwt.sign(
    { sub: admin.id, email: admin.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  setAuthCookie(res, token);
  return sendSuccess(res, { email: admin.email, name: admin.name }, "Logged in.");
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.cookieName, { path: "/" });
  return sendSuccess(res, null, "Logged out.");
});

export const me = asyncHandler(async (req: AuthedRequest, res) => {
  // requireAdmin middleware guarantees req.admin is set before this runs.
  return sendSuccess(res, req.admin, "Authenticated.");
});
