import CaseStudio from "@/studio/pages/CaseStudio";
import { getPortfoliosData as studioPortfolios } from "@/utils/pageData";
// import { TPortfolio } from '@/types/portfolio';
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import NotPageFound from "@/sharedComponets/ui/wrapper/NotPageFound";
import { TPortfolio } from "@/types/portfolio";
import Image from "next/image";
import React from "react";

// TEMP: revalidate=0 for active dev — RESET before launch (was: 60 * 60)
// Data refreshes every 5 minutes, and the cache key changes with each deploy so new images show immediately.
const REVALIDATE_SECONDS = 300;
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA || "dev").slice(0, 7);

// ===== Helper: fetch a single portfolio by slug =====
const getPortfolioData = async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios/${slug}?b=${BUILD}`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) {
      console.error(
        `Failed to fetch portfolio data for slug: ${slug}, Status: ${res.status}`
      );
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return null;
  }
};

// ===== Helper: fetch all portfolio slugs for SSG =====
const getAllPortfolioSlugs = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios?limit=999`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      console.error(
        `Failed to fetch all portfolio slugs, Status: ${res.status}`
      );
      return [];
    }
    const { portfolios } = await res.json();
    return portfolios.map((portfolio: TPortfolio) => ({
      slug: portfolio.slug,
    }));
  } catch (error) {
    console.error("Error fetching all portfolio slugs:", error);
    return [];
  }
};

// ===== Pre-render all portfolio paths =====
export async function generateStaticParams() {
  return getAllPortfolioSlugs();
}

// ===== Dynamic Metadata =====
export async function generateMetadata({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const result = await getPortfolioData(title);

  if (!result?.portfolio) {
    return {
      title: "Portfolio Not Found",
      description: "The portfolio you are looking for does not exist.",
    };
  }

  const portfolio = result?.portfolio as TPortfolio;

  const metaTitle = portfolio?.seoTitle || `${portfolio?.title} Case Study`;
  const rawDescription =
    portfolio?.seoDescription ||
    portfolio?.description ||
    `Explore details about ${portfolio.title}, a project from Webtricker Studio.`;
  const plain = String(rawDescription).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const metaDescription = plain.length > 160 ? plain.slice(0, plain.lastIndexOf(" ", 157)) + "..." : plain;

  const ogImage = portfolio?.ogImage || portfolio?.thumnail?.url;
  const ogIsDedicated = !!portfolio?.ogImage;
  const ogAlt = portfolio?.ogImageAlt || portfolio?.title;
  const brandTitle = `${metaTitle} | Webtricker`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portfolio/${portfolio.slug}`,
      siteName: "Webtricker",
      title: brandTitle,
      description: metaDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: ogIsDedicated ? 1200 : portfolio.thumnail?.width || 1200,
              height: ogIsDedicated ? 630 : portfolio.thumnail?.height || 630,
              alt: ogAlt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title: brandTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/portfolio/${portfolio.slug}`,
    },
    keywords: portfolio?.focusKeyword ? [portfolio.focusKeyword, "web design portfolio", "Webtricker"] : undefined,
    category: "technology",
  };
}

// ===== root page component =======
export default async function PortfolioDetailsPage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const { title } = await params;
  const result = await getPortfolioData(title);

  if (!result?.portfolio) return <NotPageFound />;

  const portfolio = result.portfolio as TPortfolio;

  const all = ((await studioPortfolios(999)) as any[]) || [];
  const idx = all.findIndex((x) => x.slug === portfolio.slug);
  const nx = idx >= 0 ? all[(idx + 1) % all.length] : null;
  const pv = idx >= 0 ? all[(idx - 1 + all.length) % all.length] : null;
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://webtricker.com";
  const plain = String(portfolio.seoDescription || portfolio.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${base}/portfolio/${portfolio.slug}#project`,
        name: portfolio.title,
        headline: portfolio.seoTitle || portfolio.title,
        description: plain,
        url: `${base}/portfolio/${portfolio.slug}`,
        image: portfolio.ogImage || portfolio.coverImage?.url || portfolio.thumnail?.url,
        keywords: portfolio.focusKeyword || undefined,
        dateCreated: portfolio.createdAt,
        dateModified: portfolio.updatedAt || portfolio.createdAt,
        creator: { "@type": "Organization", name: "Webtricker", url: base },
        about: portfolio.liveLink ? { "@type": "WebSite", name: portfolio.title, url: portfolio.liveLink } : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base },
          { "@type": "ListItem", position: 2, name: "Portfolio", item: `${base}/portfolio` },
          { "@type": "ListItem", position: 3, name: portfolio.title, item: `${base}/portfolio/${portfolio.slug}` },
        ],
      },
    ],
  };
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <CaseStudio
      p={portfolio}
      next={nx && nx.slug !== portfolio.slug ? { href: `/portfolio/${nx.slug}`, title: nx.title } : null}
      prev={pv && pv.slug !== portfolio.slug ? { href: `/portfolio/${pv.slug}`, title: pv.title } : null}
    />
    </>
  );
}
