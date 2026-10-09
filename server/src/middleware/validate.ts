import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";
import { ApiError } from "../utils/ApiError";

type Source = "body" | "query" | "params";

/**
 * Generic request validator: runs a Zod schema against req[source]
 * and replaces it with the parsed (and coerced/defaulted) result, so
 * controllers always receive already-validated, typed input. Backend
 * validation is authoritative — the frontend/admin form validation is
 * a UX convenience only, never trusted alone (Stage 3 spec #27).
 */
export function validate(schema: ZodTypeAny, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(
        ApiError.validation("Validation failed", result.error.flatten())
      );
    }
    req[source] = result.data;
    next();
  };
}
