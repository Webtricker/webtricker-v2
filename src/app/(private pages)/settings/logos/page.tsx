import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import PageTitle from "../../components/PageTitle";
import LargeLogoWhite from "./components/LargeLogoWhite";
import LargeLogoDark from "./components/LargeLogoDark";
import SmallLogo from "./components/SmallLogo";
import LoadSiteLogos from "@/sharedComponets/ui/logos/LoadSiteLogos";
import ResetAllLogos from "./components/ResetAllLogos";

export default function LogoCustomizationPage() {
  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-col  gap-20">
        <PageTitle key="CUSTOMIZE_MENU" title="Customize Site Logo" />
        <div className="w-full lg:px-10 ">
          <h6 className="mb-3">Light and Dark logos</h6>
          <p className="mb-4">
            It will appear in the header, footer, admin dashboard etc
          </p>

            <LoadSiteLogos />
          <div className="w-full flex items-center justify-center gap-5 2xl:gap-10">
            <LargeLogoDark />
          </div>
          <div className="w-full mt-5 flex items-center justify-center gap-5 2xl:gap-10">
            <LargeLogoWhite />
          </div>
        </div>
        <div className="w-full flex flex-col lg:px-10">
          <h6 className="mb-3">Small logo</h6>
          <p className="mb-4">
            It will appear in the sidebar or in a small area
          </p>
          <div className="w-full flex items-center gap-5 2xl:gap-10">
            <SmallLogo />
          </div>
        </div>
        <div className="w-full flex flex-col lg:px-10">
         <ResetAllLogos />
        </div>
      </div>
    </PrivatePageWrapper>
  );
}
