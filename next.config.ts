import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Only used by mock/demo product data (see src/data/products/mock-products.ts).
    // Real M&T Collection product images are served locally from /public/images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
