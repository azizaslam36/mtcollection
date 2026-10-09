import rateLimit from "express-rate-limit";

/**
 * Only applied to the login route. Brute-force protection on
 * authentication is a concrete, justified use of a rate limiter —
 * unlike blanket rate limiting on every route, which isn't part of
 * this spec and isn't added here (#28: "nothing added just for
 * appearance").
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});
