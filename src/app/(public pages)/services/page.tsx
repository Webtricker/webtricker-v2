import React from "react";
import ServicesBanner from "./components/ServicesBanner";
import OurServices from "./components/OurServices";
import ServicesPanelWrapper from "./components/ServicesPanelWrapper";
import ServicePanels from "./components/ServicePanels";

export default function ServicesPage() {
  return (
    <main className="w-full z-0">
      <ServicesBanner />
      <OurServices />
      <ServicesPanelWrapper>
        <ServicePanels />
      </ServicesPanelWrapper>
    </main>
  );
}
