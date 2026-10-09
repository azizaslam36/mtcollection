import { env } from "../../config/env";
import type { AffiliateProvider, AffiliateMetadata } from "./types";

/**
 * Myntra provider — same status as flipkart.ts: architecture in
 * place, no live implementation, because no Myntra affiliate API
 * credentials are available to build or verify against. See
 * flipkart.ts's header comment for the completion steps; the same
 * pattern applies here with MYNTRA_AFFILIATE_ID / MYNTRA_AFFILIATE_TOKEN.
 */
export const myntraProvider: AffiliateProvider = {
  platform: "Myntra",

  matches(url: string) {
    try {
      const host = new URL(url).hostname;
      return host.includes("myntra.com") || host.includes("myntr.it");
    } catch {
      return false;
    }
  },

  isConfigured() {
    return Boolean(
      env.affiliate.myntra.affiliateId && env.affiliate.myntra.affiliateToken
    );
  },

  async fetchMetadata(_url: string): Promise<AffiliateMetadata> {
    if (!this.isConfigured()) {
      throw new Error(
        "Myntra affiliate API is not configured (MYNTRA_AFFILIATE_ID / MYNTRA_AFFILIATE_TOKEN missing). Use manual product entry instead."
      );
    }
    throw new Error(
      "Myntra metadata fetch is not implemented yet. Enter product details manually."
    );
  },
};
