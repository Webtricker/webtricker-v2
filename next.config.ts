import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['liko.foxthemes.me','webtricker.com','res.cloudinary.com'],
  },
  compiler:{
    //  removeConsole: process.env.NODE_ENV === 'production',
  }
};

export default nextConfig;
