import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";

export const healthCheck = asyncHandler(async (_req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      db: dbState === 1 ? "connected" : "not connected",
      uptimeSeconds: Math.round(process.uptime()),
    },
    message: "Healthy",
  });
});
