import { Metadata } from "next";
import HomeStudio from "@/studio/home/HomeStudio";

// Active dev mode disabled for performance
export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "Webtricker | Web Design & Development Agency – WordPress, Shopify, Next.js" },
  description:
    "Since 2014, 17+ years building fast, secure WordPress, WooCommerce, Shopify, Next.js and Laravel websites. 5,000+ projects. Book a free consultation.",
  keywords: [
    "web design",
    "web development",
    "Next.js",
    "React",
    "SEO",
    "digital agency",
    "Webtricker",
  ],
  authors: [{ name: "Webtricker Team", url: "https://webtricker.com" }],
  creator: "Webtricker",
  publisher: "Webtricker",

  // For social media
  openGraph: {
    type: "website",
    url: "https://webtricker.com",
    title: "Webtricker | Web Design & Development Agency – WordPress, Shopify, Next.js",
    description:
      "Since 2014, 17+ years building fast, secure WordPress, WooCommerce, Shopify, Next.js and Laravel websites. 5,000+ projects. Book a free consultation.",
    siteName: "Webtricker",
    images: [
      {
        url: "/opengraph-image.png",
        alt: "webtricker web design and development agency",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@webtricker",
    title: "Webtricker | Web Design & Development Agency – WordPress, Shopify, Next.js",
    description:
      "Since 2014, 17+ years building fast, secure WordPress, WooCommerce, Shopify, Next.js and Laravel websites. 5,000+ projects. Book a free consultation.",
    images: ["/opengraph-image.png"],
  },

  alternates: {
    canonical: "https://webtricker.com",
    languages: {
      "en-US": "https://webtricker.com",
    },
  },

  verification: {
    google: "3yJ9kU21qPn-t-QHCQtsra9Rv8UoWS03zAEy4p1yf6Q",
    other: {
      "p:domain_verify": "501935585d9580c201185f324b691844",
      "msvalidate.01": "89B449D5B4F0E16D64B67CF4D3CD9C7D",
      "google-tag-manager": "GTM-T26D8442",
      "google-analytics": "G-F53LQ46RXD",
    },
  },
  category: "technology",
  metadataBase: new URL("https://webtricker.com"),
};

export const dynamic = "force-static";

export default function Home() {
  return <HomeStudio />;
}
