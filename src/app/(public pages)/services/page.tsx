import React from "react";
import ServicesBanner from "./components/ServicesBanner";
import OurServices from "./components/OurServices";
import ServicesPanelWrapper from "./components/ServicesPanelWrapper";
import ServicePanels from "./components/ServicePanels";
import { getServicesData, getServicesPageData } from "@/utils/pageData";
import shortLogo from "@/assets/images/home/webtricker-w.png";
import { IServicesPage } from "@/types/pageTypes";

export async function generateMetadata() {
  const data = await getServicesData();
  const titles = data?.map((service: { title: string }) => service.title) ?? [];

  return {
    title: "Our Services | Webtricker",
    description: "Explore the range of services we offer at Webtricker.",
    keywords: titles,
    openGraph: {
      title: "Webtricker - Our Services",
      description: "Explore the range of services we offer at Webtricker.",
      images: [
        {
          url: `${shortLogo.src}`,
          width: 1200,
          height: 630,
          alt: "Webtricker Services Banner",
        },
      ],
    },
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