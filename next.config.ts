import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Enforced policy: limits where scripts, frames, media and connections may come from, and blocks
// plugins, <base> hijacking, form hijacking and framing.
const enforcedCsp = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "manifest-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https://res.cloudinary.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.g.doubleclick.net https://*.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://vitals.vercel-insights.com https://api.cloudinary.com https://res.cloudinary.com wss://*.pusher.com https://*.pusher.com",
  "frame-src 'self' https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
  "worker-src 'self' blob:",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: enforcedCsp },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  experimental: { inlineCss: true },
  /* config options here */
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Static media is replaced in place now and then, so cache for a day and revalidate in the background.
        source: "/:dir(videos|images|svgs|css)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/:dir(fonts|icons)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" }],
      },
      {
        // Responses from the API (sessions, bookings, auth) must never be cached by shared proxies.
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
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
