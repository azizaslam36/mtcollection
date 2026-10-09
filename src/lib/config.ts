/**
 * Central app configuration derived from environment variables.
 * Keeping this in one place means no component ever hardcodes an
 * analytics ID, feature flag, or similar config value directly.
 */

/**
 * Google Analytics 4 Measurement ID.
 * Previously hardcoded in every page of the old static site as
 * "G-KFG6M3Y4P2". Now sourced from NEXT_PUBLIC_GA_ID (see .env.example).
 * The actual <Script> wiring happens in a later stage (root layout /
 * analytics component) — this constant just makes the value available
 * without hardcoding it anywhere.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/**
 * Controls whether mock/demo product & category data is included
 * alongside real M&T Collection data. Defaults to true (shown) so
 * demo data is visible during local development unless explicitly
 * disabled.
 *
 * IMPORTANT: Set NEXT_PUBLIC_SHOW_DEMO_DATA=false before production
 * / client delivery to remove all demo data from the site in one step.
 */
export const SHOW_DEMO_DATA = process.env.NEXT_PUBLIC_SHOW_DEMO_DATA !== "false";
