import React from "react";
import CheckAccessToken from "./components/CheckAccessToken";
import LoadSiteLogos from "@/sharedComponets/ui/logos/LoadSiteLogos";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <LoadSiteLogos />
      <CheckAccessToken />
    </>
  );
}
