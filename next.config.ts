import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liko.foxthemes.me",
      },
      {
        protocol: "https",
        hostname: "webtricker.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  compiler: {
    //  removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
