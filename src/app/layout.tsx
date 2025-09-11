import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/reduxProvider";
import BodyEventListeners from "@/sharedComponets/DOM/BodyEventListeners";
import ReactToastifyMessage from "@/sharedComponets/DOM/ReactToastifyMessage";
import { ThemeProvider } from "@/provider/ThemeProvider";
import InitializeAnimationPlugin from "@/sharedComponets/DOM/InitializeAnimationPlugin";
import BodyScrollController from "@/sharedComponets/DOM/BodyScrollController";
// import { Suspense } from "react";
// import LiveChat from "@/sharedComponets/DOM/LiveChat";
import WhatsAppChat from "@/sharedComponets/DOM/WhatsAppChat";
import PageTransition from "@/sharedComponets/DOM/PageTransition";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

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
    images: ["/opengraph-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`z-0 wt_fs-base ${lato.className} ${lato.variable}`}>
        <ThemeProvider>
          <ReduxProvider>
            <PageTransition>{children}</PageTransition>

            {/* Live chat */}
            {/* <Suspense fallback={null}>
              <LiveChat></LiveChat>
            </Suspense> */}

            {/* WhatsApp chat */}
            <WhatsAppChat />

            {/* Demo dark theme toggler to check dark / light theem */}
            {/* <DemoThemeToggler /> */}

            {/* ===== portal to show modals ====== */}
            <div className="w-full" id="modal_portal"></div>
            <BodyEventListeners />
            <InitializeAnimationPlugin />
            <BodyScrollController />
          </ReduxProvider>
        </ThemeProvider>
        <ReactToastifyMessage />
      </body>
    </html>
  );
}
