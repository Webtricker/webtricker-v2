import CursorDot from "@/sharedComponets/DOM/CursorDot";
import Footer from "@/sharedComponets/ui/footer/Footer";
import Navbar from "@/sharedComponets/ui/header/Navbar";
import React, { ReactNode } from "react";
import NavbarInner from "@/sharedComponets/ui/header/NavbarInner";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: {
//     default: "Webtricker - Expert Web Design & Digital Services",
//     template: `%s`,
//   },
//   twitter: {
//     card: "summary_large_image",
//     description: "webtricker web design and development agency",
//     images: [
//       {
//         alt: "webtricker web design and development agency",
//         url: "/opengraph-image.png",
//       },
//     ],
//   },

//   openGraph: {
//     // description: "webtricker web design and development agency",
//     images: [
//       {
//         alt: "webtricker web design and development agency",
//         url: "/opengraph-image.png",
//       },
//     ],
//   },
//   verification: {
//     google: "3yJ9kU21qPn-t-QHCQtsra9Rv8UoWS03zAEy4p1yf6Q",

//     other: {
//       "p:domain_verify": "501935585d9580c201185f324b691844",
//       "msvalidate.01": "89B449D5B4F0E16D64B67CF4D3CD9C7D",
//       "google-tag-manager": "GTM-T26D8442",
//       "google-analytics": "G-F53LQ46RXD",
//     },
//   },
// };

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
