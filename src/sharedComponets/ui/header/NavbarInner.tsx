import { IMainHeader, ISidebar, ITopHeader } from "@/types/componentsType";
import {
  getMainHeaderData,
  getSidebarData,
  getTobBarInfo,
} from "@/utils/pageData";
import React from "react";
import SiteLogoLong from "../logos/SiteLogoLong";
import SiteLogo from "./SiteLogo";
import SidebarToggler from "./SidebarToggler";
import Container from "../wrapper/Container";
import TopBar from "@/sharedComponets/DOM/TopBar";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default async function NavbarInner() {
  const mainHeaderData = (await getMainHeaderData()) as IMainHeader;
  const topBarInfo = (await getTobBarInfo()) as ITopHeader;
  const sidebarData = (await getSidebarData()) as ISidebar;
  return (
    <>
      <TopBar info={topBarInfo} />
      <Container >
        <div className="w-full flex items-center justify-center">
          <SiteLogo>
            <SiteLogoLong logos={mainHeaderData?.logo} />
          </SiteLogo>
          {/* links */}
          <div className="hidden lg:inline-flex items-center gap-5 md:gap-6 lg:gap-7 xl:gap-8">
            {mainHeaderData?.links &&
              mainHeaderData?.links.map(({ href, label }) => (
                <Link
                  className="wt_header-navlink heading capitalize cursor-pointer"
                  key={label}
                  href={href}
                >
                  {label}
                </Link>
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
