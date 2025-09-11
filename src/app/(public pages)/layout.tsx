import CursorDot from "@/sharedComponets/DOM/CursorDot";
import Footer from "@/sharedComponets/ui/footer/Footer";
import Navbar from "@/sharedComponets/ui/header/Navbar";
import React, { ReactNode } from "react";
import NavbarInner from "@/sharedComponets/ui/header/NavbarInner";
import PageTransition from "@/sharedComponets/DOM/PageTransition";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PageTransition>
        <Navbar>
          <NavbarInner />
        </Navbar>
        {children}
        <CursorDot />
        <Footer />
      </PageTransition>
    </>
  );
}
