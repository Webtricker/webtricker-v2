import CursorDot from "@/sharedComponets/DOM/CursorDot";
import Footer from "@/sharedComponets/ui/footer/Footer";
import Navbar from "@/sharedComponets/ui/header/Navbar";
import React, { ReactNode } from "react";
import NavbarInner from "@/sharedComponets/ui/header/NavbarInner";
import PageTransition from "@/sharedComponets/DOM/PageTransition";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Webtricker",
    template: "%s | Webtricker",
  },
  description:
    "Webtricker - Web Design and Development Agency offering professional websites, apps, and digital solutions.",
  keywords: [
    "web design",
    "web development",
    "Next.js",
    "React",
    "SEO",
    "digital agency",
    "Webtricker",
  ],
  authors: [{ name: "Webtricker Team", url: "https://webtricker.com" }],
  creator: "Webtricker",
  publisher: "Webtricker",

  // For social media
  openGraph: {
    type: "website",
    url: "https://webtricker.com",
    title: "Webtricker - Web Design and Development Agency",
    description:
      "We create fast, modern, and SEO-friendly websites & applications.",
    siteName: "Webtricker",
    images: [
      {
        url: "/opengraph-image.png",
        alt: "webtricker web design and development agency",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@webtricker",
    title: "Webtricker - Web Design and Development Agency",
    description:
      "We build websites, apps, and digital experiences that grow your business.",
  },

  alternates: {
    canonical: "https://webtricker.com",
    languages: {
      "en-US": "https://webtricker.com",
    },
  },

  verification: {
    google: "3yJ9kU21qPn-t-QHCQtsra9Rv8UoWS03zAEy4p1yf6Q",

    other: {
      "p:domain_verify": "501935585d9580c201185f324b691844",
      "msvalidate.01": "89B449D5B4F0E16D64B67CF4D3CD9C7D",
      "google-tag-manager": "GTM-T26D8442",
      "google-analytics": "G-F53LQ46RXD",
    },
  },
  category: "technology",
  metadataBase: new URL("https://webtricker.com"),
};


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
