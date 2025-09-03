import CursorDot from "@/sharedComponets/DOM/CursorDot";
import Footer from "@/sharedComponets/ui/footer/Footer";
import Navbar from "@/sharedComponets/ui/header/Navbar";
import React, { ReactNode } from "react";
import NavbarInner from "@/sharedComponets/ui/header/NavbarInner";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar>
        <NavbarInner />
      </Navbar>
      {children}
      <CursorDot />
      <Footer />
    </>
  );
}
