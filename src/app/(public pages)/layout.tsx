import CursorDot from "@/sharedComponets/DOM/CursorDot";
import Footer from "@/sharedComponets/ui/footer/Footer";
import Navbar from "@/sharedComponets/ui/header/Navbar";
import React, { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}

      <CursorDot />
      <Footer />
    </>
  );
}
