import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

/**
 * Reuses a single mongoose connection across the process rather than
 * opening a new one per request. Safe to call multiple times — it's
 * a no-op if already connected (relevant for serverless-style hosts
 * that may re-invoke the module).
 */
export async function connectDB(): Promise<void> {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(env.mongodbUri);
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log("[db] MongoDB connected");
  } catch (err) {
    // Fail loudly and exit — the app is not useful without a DB
    // connection, and swallowing this would surface as confusing
    // downstream errors on every request instead.
    // eslint-disable-next-line no-console
    console.error("[db] MongoDB connection failed:", err);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    // eslint-disable-next-line no-console
    console.warn("[db] MongoDB disconnected");
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  isConnected = false;
}
