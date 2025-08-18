import React from "react";
import ServicesBanner from "./components/ServicesBanner";
import OurServices from "./components/OurServices";
import ServicesPanelWrapper from "./components/ServicesPanelWrapper";
import ServicePanels from "./components/ServicePanels";
import { getServicesData } from "@/utils/pageData";
import shortLogo from "@/assets/images/home/webtricker-w.png";

// dynamic metadata for services page
export async function generateMetadata() {
  const data = await getServicesData();
  return {
    title: "Our Services | Webtricker",
    description: "Explore the range of services we offer at Webtricker.",
    keywords: [
      data.map((service: { title: string }) => service.title).join(", "),
    ],
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
  const serviceData = await getServicesData();

  return (
    <main className="w-full z-0">
      <ServicesBanner />
      <OurServices services={serviceData} />
      <ServicesPanelWrapper>
        <ServicePanels services={serviceData} />
      </ServicesPanelWrapper>
    </main>
  );
}
