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

type SiteConfig = {
  contact?: {
    phones?: string[];
    emails?: string[];
  };
  offices?: {
    label: string;
    addressText: string;
  }[];
  socialLinks?: {
    platform: string;
    href: string;
    isExternal: boolean;
  }[];
};

async function getSiteConfigData(): Promise<SiteConfig | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/site-config`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    const result = await res.json();
    return result?.data ?? null;
  } catch {
    return null;
  }
}

export default async function NavbarInner() {
  const mainHeaderData = (await getMainHeaderData()) as IMainHeader;
  const sidebarData = (await getSidebarData()) as ISidebar;
  const siteConfigData = await getSiteConfigData();
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
        siteConfigData={siteConfigData}
        key="PUBLIC_SIDEBAR"
      />
    </>
  );
}
