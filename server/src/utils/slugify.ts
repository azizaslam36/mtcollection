/**
 * Simple, dependency-free slugify — matches the kebab-case style
 * already used throughout the Stage 1/2 frontend data (see
 * src/data/products/real-products.ts in the frontend project).
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
