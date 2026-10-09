import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";
import { importFromAffiliateUrl } from "../services/affiliate";

export const importAffiliateUrl = asyncHandler(async (req, res) => {
  const url = req.body?.url;
  if (!url || typeof url !== "string") {
    throw ApiError.badRequest("A product URL is required.");
  }
  const result = await importFromAffiliateUrl(url);
  return sendSuccess(res, result, result.message);
});
