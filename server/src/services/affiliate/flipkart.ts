import { env } from "../../config/env";
import type { AffiliateProvider, AffiliateMetadata } from "./types";

/**
 * Flipkart provider — architecture only.
 *
 * Flipkart's official affiliate program exposes a product feed /
 * search API that requires an approved affiliate account (Fk-Affiliate-Id
 * / Fk-Affiliate-Token headers). No credentials are available in this
 * environment, so `fetchMetadata` is intentionally left unimplemented
 * rather than guessed at or faked — implementing against an API this
 * project has never actually called would risk shipping code that
 * silently does the wrong thing.
 *
 * To finish this integration once you have Flipkart affiliate
 * credentials:
 *   1. Set FLIPKART_AFFILIATE_ID / FLIPKART_AFFILIATE_TOKEN in .env.
 *   2. Implement the fetch call below against Flipkart's affiliate
 *      product API docs, mapping their response fields to
 *      AffiliateMetadata.
 *   3. isConfigured() already gates on the env vars being present —
 *      no other code needs to change.
 */
export const flipkartProvider: AffiliateProvider = {
  platform: "Flipkart",

  matches(url: string) {
    try {
      const host = new URL(url).hostname;
      return host.includes("flipkart.com") || host.includes("fktr.in");
    } catch {
      return false;
    }
  },

  isConfigured() {
    return Boolean(
      env.affiliate.flipkart.affiliateId && env.affiliate.flipkart.affiliateToken
    );
  },

  async fetchMetadata(_url: string): Promise<AffiliateMetadata> {
    if (!this.isConfigured()) {
      throw new Error(
        "Flipkart affiliate API is not configured (FLIPKART_AFFILIATE_ID / FLIPKART_AFFILIATE_TOKEN missing). Use manual product entry instead."
      );
    }
    // NOT IMPLEMENTED: no credentials available to build/verify this
    // integration against the real API. See the file header comment.
    throw new Error(
      "Flipkart metadata fetch is not implemented yet. Enter product details manually."
    );
  },
};
