import React from "react";
import ServicesBanner from "./components/ServicesBanner";
import OurServices from "./components/OurServices";
import ServicesPanelWrapper from "./components/ServicesPanelWrapper";
import ServicePanels from "./components/ServicePanels";
import { getServicesData } from "@/utils/pageData";

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