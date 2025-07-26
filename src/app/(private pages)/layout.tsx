import React from "react";
import PrivateSidebar from "./components/PrivateSidebar";
import PrivateNavbar from "./components/PrivateNavbar";
import CheckAccessToken from "./components/CheckAccessToken";
import SiteLogoLong from "@/sharedComponets/ui/logos/SiteLogoLong";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-start">
      <PrivateSidebar>
        <SiteLogoLong />
      </PrivateSidebar>
      <div className="grow  h-full flex flex-col">
        <PrivateNavbar>
          <SiteLogoLong />
        </PrivateNavbar>
        {children}
      </div>

      <CheckAccessToken />
    </div>
  );
}
