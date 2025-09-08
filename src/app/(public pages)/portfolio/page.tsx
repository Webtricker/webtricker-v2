import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import PortfoliosContainer from "./components/PortfoliosContainer";
import { getPortfolioPageData, getTechnologies } from "@/utils/pageData";
import PortfolioBanner from "./components/PortfolioBanner";
import shortLogo from "@/assets/images/home/webtricker-w.png";
import { IPortfolioPage } from "@/types/pageTypes";

// dynamic metadata for the portfolio page
export async function generateMetadata() {
  const technologiesData = await getTechnologies();

  // flatten technology names into keyword array
  const techKeywords = technologiesData.map((tech: { name: string }) => tech.name);

  const title = "Webtricker - Our Portfolio";
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

export default async function PortfolioPage() {
  const technologiesData = await getTechnologies();
  const pageData = (await getPortfolioPageData()) as IPortfolioPage;
  return (
    <main className="w-full z-0">
      <PortfolioBanner
        bannerSlider={pageData?.bannerSlider || {}}
        imageDuration={8000}
        rows={4}
        cols={7}
      />
      <section className="section-speacing">
        <Container className="!max-w-[1200px]">
          <p className="bold flex items-center gap-1">
            <span>{pageData?.projectIntroduction?.companyName || ""}</span>
            <span className="w-10 h-[1px] mt-1.5 bg-black dark:bg-white"></span>
          </p>
          <h2 className="heading xl:font-semibold !leading-[100%]">
            {pageData?.projectIntroduction?.title || ""}
          </h2>
          <p className="mx-auto max-w-[500px] mt-5">
            {pageData?.projectIntroduction?.description || ""}
          </p>
        </Container>
      </section>
      <PortfoliosContainer technologies={technologiesData} />
      <Container className="w-full flex flex-col">
        <p className="bold text-center mb-2 lg:mb-0">
          {pageData?.bottomText?.expression || ""}
        </p>
        <h2 className="wt_fs-big text-center heading">
          {pageData?.bottomText?.title || ""}
        </h2>
      </Container>
    </main>
  );
}
