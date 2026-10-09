import { ApiError } from "../../utils/ApiError";
import { flipkartProvider } from "./flipkart";
import { myntraProvider } from "./myntra";
import type { AffiliateProvider, AffiliateMetadata, SupportedPlatform } from "./types";

const providers: AffiliateProvider[] = [flipkartProvider, myntraProvider];

export function detectPlatform(url: string): SupportedPlatform {
  const match = providers.find((p) => p.matches(url));
  return match?.platform ?? "Other";
}

export interface ImportResult {
  platform: SupportedPlatform;
  automated: boolean;
  metadata?: AffiliateMetadata;
  message: string;
}

/**
 * The single entry point the admin "import from URL" endpoint calls.
 * Always succeeds at detecting the platform; only *attempts* the
 * automated fetch, and always reports back clearly whether it worked
 * so the admin UI can fall back to a manual form pre-filled with just
 * the detected platform + original URL. Never throws for the
 * "no credentials configured" case — that's an expected, normal
 * outcome in this project today, not a server error.
 */
export async function importFromAffiliateUrl(url: string): Promise<ImportResult> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw ApiError.badRequest("Please provide a valid product URL.");
  }

  const provider = providers.find((p) => p.matches(parsed.toString()));

  if (!provider) {
    return {
      platform: "Other",
      automated: false,
      message:
        "Platform not recognized. Enter product details manually — the URL can still be used as the affiliate link.",
    };
  }

  if (!provider.isConfigured()) {
    return {
      platform: provider.platform,
      automated: false,
      message: `${provider.platform} detected, but no affiliate API credentials are configured. Enter product details manually.`,
    };
  }

  try {
    const metadata = await provider.fetchMetadata(parsed.toString());
    return {
      platform: provider.platform,
      automated: true,
      metadata,
      message: `Fetched product details from ${provider.platform}. Review before publishing.`,
    };
  } catch (err) {
    return {
      platform: provider.platform,
      automated: false,
      message:
        err instanceof Error
          ? err.message
          : `Could not fetch details from ${provider.platform}. Enter product details manually.`,
    };
  }
}
