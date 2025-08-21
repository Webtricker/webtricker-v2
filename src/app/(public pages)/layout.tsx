import CursorDot from "@/sharedComponets/DOM/CursorDot";
import Footer from "@/sharedComponets/ui/footer/Footer";
import Navbar from "@/sharedComponets/ui/header/Navbar";
import SiteLogoLong from "@/sharedComponets/ui/logos/SiteLogoLong";
import { getSiteLogos } from "@/utils/logo";
import React, { ReactNode } from "react";
import webtrickerW from "@/assets/images/home/webtricker-w.png";
import PageTransition from "@/sharedComponets/DOM/PageTransition";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  let smallLogo: string | null = null;
  try {
    const result = await getSiteLogos();
    if (result) {
      smallLogo = result?.smallLogo || null;
    }
  } catch (error) {
    console.error("Error fetching site logos:", error);
  }

  const finalSmallLogo = smallLogo || webtrickerW;
  return (
    <PageTransition>
      <Navbar siteShortLogoUrl={finalSmallLogo}>
        <SiteLogoLong />
      </Navbar>
      {children}
      <CursorDot />
      <Footer />
    </PageTransition>
  );
}
