import dotenv from "dotenv";

dotenv.config();

/**
 * Fail fast on missing required env vars rather than surfacing a
 * confusing error later (e.g. mongoose hanging on an empty URI).
 * Optional affiliate-provider vars are intentionally NOT required
 * here — the app must run fully in manual-entry mode without them.
 */
const REQUIRED_VARS = ["MONGODB_URI", "JWT_SECRET", "FRONTEND_URL"] as const;

function getRequiredEnv(name: (typeof REQUIRED_VARS)[number]): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy server/.env.example to server/.env and fill it in.`
    );
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT ?? 4000),

  get mongodbUri() {
    return getRequiredEnv("MONGODB_URI");
  },
  get jwtSecret() {
    return getRequiredEnv("JWT_SECRET");
  },
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  cookieName: process.env.COOKIE_NAME ?? "mt_admin_token",

  get frontendUrl() {
    return getRequiredEnv("FRONTEND_URL");
  },

  adminEmail: process.env.ADMIN_EMAIL ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",

  /**
   * Mirrors the frontend's NEXT_PUBLIC_SHOW_DEMO_DATA concept (see
   * Stage 1/2 src/lib/config.ts). Hard-disabled whenever
   * NODE_ENV=production, regardless of the env var — demo data must
   * never be an accidental production toggle away from live (spec #8).
   */
  get showDemoData() {
    return !this.isProduction && process.env.SHOW_DEMO_DATA === "true";
  },

  affiliate: {
    flipkart: {
      affiliateId: process.env.FLIPKART_AFFILIATE_ID ?? "",
      affiliateToken: process.env.FLIPKART_AFFILIATE_TOKEN ?? "",
    },
    myntra: {
      affiliateId: process.env.MYNTRA_AFFILIATE_ID ?? "",
      affiliateToken: process.env.MYNTRA_AFFILIATE_TOKEN ?? "",
    },
  },
};

/**
 * Call explicitly at server startup (not at import time) so a
 * missing var produces one clear startup error instead of a
 * scattered runtime failure the first time a route touches it.
 */
export function assertRequiredEnv() {
  for (const key of REQUIRED_VARS) {
    getRequiredEnv(key);
  }
}
