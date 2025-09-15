// import { TPortfolio } from '@/types/portfolio';
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import NotPageFound from "@/sharedComponets/ui/wrapper/NotPageFound";
import { TPortfolio } from "@/types/portfolio";
import Image from "next/image";
import React from "react";

const REVALIDATE_SECONDS = 60 * 60;

// ===== Helper: fetch a single portfolio by slug =====
const getPortfolioData = async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios/${slug}`,
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

  const metaTitle = `${portfolio?.title} | Portfolios`;
  const metaDescription =
    portfolio?.description ||
    `Explore details about ${portfolio.title}, a project from Webtricker Studio.`;

  const ogImage = portfolio?.thumnail?.url;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portfolio/${portfolio.slug}`,
      siteName: "Webtricker",
      title: metaTitle,
      description: metaDescription,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: portfolio.thumnail?.width || 1200,
              height: portfolio.thumnail?.height || 630,
              alt: portfolio.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/portfolio/${portfolio.slug}`,
    },
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

  if (!result?.portfolio) return <NotPageFound />

  const portfolio = result.portfolio as TPortfolio;

  return (
    <main className="w-full z-0 section-speacing mt-10 post-details-container">
      <BlogPageContainer className="section-speacing">
        <p className="text-center font-medium flex items-center justify-center gap-1">
          Live Link:
          <a
            href={portfolio?.liveLink}
            target="_blank"
            className="text-[#aa013f] font-normal flex items-center gap-1 animate-underline"
          >
            {portfolio?.liveLink} <ArrowUpRightIcon />
          </a>
        </p>
        <h1 className="wt_fs-5xl text-center my-3">{portfolio.title}</h1>
        <Image
          src={portfolio?.thumnail?.url || ""}
          width={portfolio?.thumnail?.width || 912}
          height={portfolio?.thumnail?.height || 400}
          alt={portfolio?.title}
          className="w-full h-auto my-10"
          priority
        />
        <p>{portfolio?.description}</p>
      </BlogPageContainer>
      <section className="w-full wt_parser_content">
        <BlogPageContainer>
          <HtmlContentParser htmlContent={portfolio?.content} />
        </BlogPageContainer>
      </section>
    </main>
  );
}
