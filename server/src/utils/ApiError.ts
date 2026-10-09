/**
 * Thrown by controllers/services for any expected failure (bad
 * input, not found, unauthorized, conflict). The global error
 * handler (middleware/errorHandler.ts) knows how to turn this into
 * the standard API error response with the right status code.
 * Anything NOT an ApiError is treated as an unexpected 500 and its
 * details are hidden from the client in production.
 */
export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message = "Invalid request", details?: unknown) {
    return new ApiError(400, message, details);
  }
  static unauthorized(message = "Authentication required") {
    return new ApiError(401, message);
  }
  static forbidden(message = "Not authorized") {
    return new ApiError(403, message);
  }
  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }
  static conflict(message = "Conflict", details?: unknown) {
    return new ApiError(409, message, details);
  }
  static validation(message = "Validation failed", details?: unknown) {
    return new ApiError(422, message, details);
  }
}
