import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/reduxProvider";
import BodyEventListeners from "@/sharedComponets/DOM/BodyEventListeners";
import ReactToastifyMessage from "@/sharedComponets/DOM/ReactToastifyMessage";
import { ThemeProvider } from "@/provider/ThemeProvider";
import DemoThemeToggler from "@/tests/DemoThemeToggler";
import InitializeAnimationPlugin from "@/sharedComponets/DOM/InitializeAnimationPlugin";
import BodyScrollController from "@/sharedComponets/DOM/BodyScrollController";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Webtricker",
    template: "%s | Webtricker",
  },
  description: "Web Design and Development Agency",
  twitter: {
    card: "summary_large_image",
    description: "webtricker web design and development agency",
    images: [
      {
        alt: "webtricker web design and development agency",
        url: "/opengraph-image.png",
      },
    ],
  },

  openGraph: {
    images: [
      {
        alt: "webtricker web design and development agency",
        url: "/opengraph-image.png",
      },
    ],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`z-0 wt_fs-base ${syne.className} ${syne.variable}`}>
        <ThemeProvider>
          <ReduxProvider>
            {/* <PageTransition> */}
              {children}
              {/* </PageTransition> */}

            {/* Demo dark theme toggler to check dark / light theem */}
            <DemoThemeToggler />

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
