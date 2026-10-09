/**
 * Idempotent seed script.
 *
 * Safe to run multiple times: categories and products are upserted
 * by slug, never duplicated. Never wipes existing data (no
 * deleteMany calls) — per Stage 3 spec #41/#42, this must not be a
 * destructive reset.
 *
 * Usage:  npm run seed   (from server/)
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../src/config/env";
import { connectDB, disconnectDB } from "../src/config/db";
import { Category } from "../src/models/Category";
import { Product } from "../src/models/Product";
import { AdminUser } from "../src/models/AdminUser";
import { realCategorySeed, realProductSeeds } from "./data";

async function seedCategory() {
  const category = await Category.findOneAndUpdate(
    { slug: realCategorySeed.slug },
    { $setOnInsert: realCategorySeed },
    { upsert: true, new: true }
  );
  console.log(`[seed] Category ready: ${category.name} (${category.slug})`);
  return category;
}

async function seedProducts(categoryId: mongoose.Types.ObjectId) {
  let created = 0;
  let skipped = 0;

  for (const seed of realProductSeeds) {
    const existing = await Product.findOne({ slug: seed.slug });
    if (existing) {
      skipped++;
      continue;
    }

    await Product.create({
      ...seed,
      category: categoryId,
      isDemo: false,
      active: true,
    });
    created++;
  }

  console.log(`[seed] Products: ${created} created, ${skipped} already existed.`);
}

async function seedAdmin() {
  if (!env.adminEmail || !env.adminPassword) {
    console.log(
      "[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user creation. Set both in server/.env to create one."
    );
    return;
  }

  const existing = await AdminUser.findOne({ email: env.adminEmail });
  if (existing) {
    console.log(`[seed] Admin user already exists: ${env.adminEmail}`);
    return;
  }

  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await AdminUser.create({ email: env.adminEmail, passwordHash });
  console.log(`[seed] Admin user created: ${env.adminEmail}`);
}

async function run() {
  await connectDB();

  const category = await seedCategory();
  await seedProducts(category._id as mongoose.Types.ObjectId);
  await seedAdmin();

  await disconnectDB();
  console.log("[seed] Done.");
}

run().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
