import type { NextConfig } from "next";

/**
 * Next.js 15 configuration
 *
 * images.remotePatterns: allow Picsum Photos (our mock product images).
 * In production, add your CDN domain here.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
