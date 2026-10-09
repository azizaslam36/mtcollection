import { createApp } from "./app";
import { connectDB } from "./config/db";
import { assertRequiredEnv, env } from "./config/env";

async function main() {
  assertRequiredEnv();
  await connectDB();

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] M&T Collection API listening on port ${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[server] Failed to start:", err);
  process.exit(1);
});
