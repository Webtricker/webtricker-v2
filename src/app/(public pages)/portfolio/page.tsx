import PortfolioStudio from "@/studio/pages/PortfolioStudio";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import PortfoliosContainer from "./components/PortfoliosContainer";
import { getPortfolioPageData, getTechnologies } from "@/utils/pageData";
import PortfolioBanner from "./components/PortfolioBanner";
import shortLogo from "@/assets/images/home/webtricker-w.png";
import { IPortfolioPage } from "@/types/pageTypes";
import Link from "next/link";

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 86400;

// dynamic metadata for the portfolio page
export async function generateMetadata() {
  const technologiesData = await getTechnologies();

  // flatten technology names into keyword array
  const techKeywords = technologiesData.map(
    (tech: { name: string }) => tech.name
  );

  const title = "Our Portfolios";
  const description =
    "Explore our portfolio showcasing the latest and greatest projects from Webtricker Studio.";
  const ogImageUrl = shortLogo.src;

  return {
    title,
    description,
    keywords: ["Webtricker", ...techKeywords],

    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portfolio`,
      siteName: "Webtricker",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Webtricker Portfolio",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title,
      description,
      images: [ogImageUrl],
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/portfolio`,
    },

    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    category: "technology",
  };
}

export default function Page() {
  return <PortfolioStudio />;
}
