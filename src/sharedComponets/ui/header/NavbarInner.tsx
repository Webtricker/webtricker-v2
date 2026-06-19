import { IMainHeader, ISidebar } from "@/types/componentsType";
import {
  getMainHeaderData,
  getSidebarData,
} from "@/utils/pageData";
import React from "react";
import SiteLogoLong from "../logos/SiteLogoLong";
import SiteLogo from "./SiteLogo";
import SidebarToggler from "./SidebarToggler";
import Container from "../wrapper/Container";
import TopBar from "@/sharedComponets/DOM/TopBar";
import Sidebar from "./Sidebar";
import ActiveLink from "./ActiveLink";

export default async function NavbarInner() {
  const mainHeaderData = (await getMainHeaderData()) as IMainHeader;
  const sidebarData = (await getSidebarData()) as ISidebar;
  return (
    <>
      <TopBar />
      <Container>
        <div className="w-full flex items-center justify-center 2xl:gap-18">
          <SiteLogo>
            <SiteLogoLong logos={mainHeaderData?.logo} />
          </SiteLogo>
          {/* links */}
          <div className="hidden lg:inline-flex items-center gap-5 md:gap-6 lg:gap-7 xl:gap-8">
            {mainHeaderData?.links &&
              mainHeaderData?.links.map((link) => (
                <ActiveLink key={link.href} link={link} />
              ))}
          </div>
          <SidebarToggler />
        </div>
      </Container>

      <Sidebar
        navlinks={mainHeaderData?.links || []}
        sidebarData={sidebarData}
        key="PUBLIC_SIDEBAR"
      />
    </>
  );
}
