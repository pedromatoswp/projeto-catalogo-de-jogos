import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Next.js <Image> to load images from any HTTPS source.
  // This is needed because game cover images come from external URLs.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS domains
      },
    ],
  },
};

export default nextConfig;
