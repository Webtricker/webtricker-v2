import React from "react";
import PrivateSidebar from "./components/PrivateSidebar";
import PrivateNavbar from "./components/PrivateNavbar";
import CheckAccessToken from "./components/CheckAccessToken";
import SidebarLogo from "@/sharedComponets/ui/sidebar/SidebarLogo";
import LoadSiteLogos from "@/sharedComponets/ui/logos/LoadSiteLogos";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-start">
      <PrivateSidebar>
        <SidebarLogo />
      </PrivateSidebar>
      <div className="grow h-full flex flex-col">
        <PrivateNavbar>
          <SidebarLogo />
        </PrivateNavbar>
        {children}
      </div>

      <LoadSiteLogos />
      <CheckAccessToken />
    </div>
  );
}
