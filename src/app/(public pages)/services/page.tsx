import React from "react";
import ServicesBanner from "./components/ServicesBanner";
import OurServices from "./components/OurServices";
import ServicesPanelWrapper from "./components/ServicesPanelWrapper";
import ServicePanels from "./components/ServicePanels";
import { getServicesData, getServicesPageData } from "@/utils/pageData";
import shortLogo from "@/assets/images/home/webtricker-w.png";
import { IServicesPage } from "@/types/pageTypes";

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 0;

export async function generateMetadata() {
  const data = await getServicesData();
  const titles = data?.map((service: { title: string }) => service.title) ?? [];

  const metaTitle = "Our Services";
  const metaDescription =
    "Discover the full range of professional web design, development, and digital services we offer at Webtricker.";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "Webtricker services",
      "web design",
      "web development",
      "SEO",
      "UI/UX design",
      ...titles,
    ],
    openGraph: {
      type: "website",
      url: "https://webtricker.com/services",
      siteName: "Webtricker",
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: shortLogo?.src,
          width: 1200,
          height: 630,
          alt: "Webtricker - Our Services",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title: metaTitle,
      description: metaDescription,
      images: [shortLogo.src],
    },
    alternates: {
      canonical: "https://webtricker.com/services",
    },
    category: "technology",
    authors: [{ name: "Webtricker Team", url: "https://webtricker.com" }],
    publisher: "Webtricker",
  };
}

export default async function ServicesPage() {
  const serviceData = (await getServicesData()) ?? [];
  const pageData = ((await getServicesPageData()) as IServicesPage) ?? {};

  return (
    <main className="w-full z-0">
      <ServicesBanner
        bg={pageData?.bannerBG || {}}
        banner={pageData?.banner || {}}
      />
      <OurServices
        servicesShotcut={pageData?.servicesShotcut || {}}
        services={serviceData || []}
      />
      <ServicesPanelWrapper bottomText={pageData?.bottomText || {}}>
        <ServicePanels services={serviceData} />
      </ServicesPanelWrapper>
    </main>
  );
}
