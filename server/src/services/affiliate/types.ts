export type SupportedPlatform = "Flipkart" | "Myntra" | "Amazon" | "Other";

export interface AffiliateMetadata {
  title?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  platform: SupportedPlatform;
  externalUrl: string;
}

export interface AffiliateProvider {
  platform: SupportedPlatform;
  /** Returns true if this provider recognizes/handles the given URL. */
  matches(url: string): boolean;
  /** True only when real API credentials are configured for this
   *  provider (see config/env.ts `affiliate`). When false, the
   *  provider still `matches()` URLs — callers should treat that as
   *  "detected platform, no automated data available" and fall back
   *  to manual entry, per Stage 3 spec #19. */
  isConfigured(): boolean;
  /**
   * Attempts to fetch product metadata via the platform's official
   * affiliate API. Throws if not configured or if the call fails —
   * callers must always have a manual-entry fallback path and must
   * NEVER fall back to scraping (explicitly disallowed by the spec).
   */
  fetchMetadata(url: string): Promise<AffiliateMetadata>;
}
