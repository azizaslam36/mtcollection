import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

/**
 * Single place all errors funnel through (via asyncHandler / next(err)
 * / Express's own default handling of thrown sync errors). Known
 * ApiErrors return their intended status + message. Anything else is
 * an unexpected bug: logged server-side in full, but the client only
 * ever gets a generic 500 with no stack trace or internal detail —
 * satisfying "never leak stack traces/secrets in production" (#26).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  // eslint-disable-next-line no-console
  console.error("[unhandled error]", err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again.",
    ...(env.isProduction ? {} : { debug: String(err) }),
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
