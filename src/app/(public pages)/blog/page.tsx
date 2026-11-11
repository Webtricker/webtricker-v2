import BlogStudio from "@/studio/pages/BlogStudio";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import BlogCardsContainer from "./components/BlogCardsContainer";
import { Metadata } from "next";
import { getBlogsPageData } from "@/utils/pageData";
import { IBlogPage } from "@/types/pageTypes";
import Image from "next/image";

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 300;

import shortLogo from "@/assets/images/home/webtricker-w.png"; // optional OG image

export const metadata: Metadata = {
  title: "Explore Our Blog: Ideas and Inspiration",
  description:
    "Read Webtricker’s blog for insights on responsive web design, UI/UX design, website optimization, and digital strategies.",

  keywords: [
    "Webtricker blog",
    "web design insights",
    "UI/UX design tips",
    "website optimization",
    "digital agency blog",
    "web development blog",
  ],

  openGraph: {
    type: "website",
    url: "https://webtricker.com/blog",
    siteName: "Webtricker",
    title: "Explore Our Blog: Ideas and Inspiration",
    description:
      "Read Webtricker’s blog for insights on responsive web design, UI/UX design, website optimization, and digital strategies.",
    images: [
      {
        url: shortLogo.src, // OG image for blog listing
        width: 1200,
        height: 630,
        alt: "Webtricker - Web Design & Development Agency Blog",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@webtricker", // optional, your brand Twitter handle
    title: "Explore Our Blog: Ideas and Inspiration",
    description:
      "Check out Webtricker’s blog for web design, UI/UX, and optimization tips for modern websites.",
    images: [shortLogo.src],
  },

  alternates: {
    canonical: "https://webtricker.com/blog",
  },

  category: "technology",
  metadataBase: new URL("https://webtricker.com"),
};
export default function Page() {
  return <BlogStudio />;
}
