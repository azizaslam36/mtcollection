import type { Response } from "express";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Consistent success envelope for a single resource. */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) {
  return res.status(statusCode).json({ success: true, data, message });
}

/** Consistent success envelope for a paginated list. */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: Pagination,
  message = "Success"
) {
  return res.status(200).json({ success: true, data, pagination, message });
}
