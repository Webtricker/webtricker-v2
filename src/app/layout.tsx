import type { Metadata } from "next";
import {
  Lato,
  Inter_Tight,
  Newsreader,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/reduxProvider";
import BodyEventListeners from "@/sharedComponets/DOM/BodyEventListeners";
import ReactToastifyMessage from "@/sharedComponets/DOM/ReactToastifyMessage";
import { ThemeProvider } from "@/provider/ThemeProvider";
import InitializeAnimationPlugin from "@/sharedComponets/DOM/InitializeAnimationPlugin";
import BodyScrollController from "@/sharedComponets/DOM/BodyScrollController";
// import { Suspense } from "react";
// import LiveChat from "@/sharedComponets/DOM/LiveChat";
import DelayedWidgets from "@/sharedComponets/DOM/DelayedWidgets";
import BusinessSchema from "@/sharedComponets/DOM/BusinessSchema";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

// Active dev mode disabled for performance
export const revalidate = 86400;

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

// Studio theme fonts, applied only inside the public site (.studio in globals.css)
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  variable: "--font-newsreader",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Public pages default to the dark Studio theme; admin and login keep their own look.
const THEME_INIT = `(function(){try{var p=location.pathname;if(p.indexOf('/settings')===0||p.indexOf('/login')===0)return;var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add('dark')}})()`;

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
    <html lang="en" suppressHydrationWarning>

      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <Script
          id="clarity-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "sljjh41puk");
            `,
          }}
        />

        <BusinessSchema />

        {/* Server-rendered so search and AI crawlers that skip JavaScript still see it.
            The logo is intentionally omitted until Site Config holds a valid logo URL. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://webtricker.com/#organization",
                name: "Webtricker",
                legalName: "Webtricker LLC",
                url: "https://webtricker.com",
                description:
                  "Webtricker is a web design and development agency offering professional websites, apps, and digital solutions.",
                sameAs: [
                  "https://www.facebook.com/webtricker",
                  "https://x.com/webtricker",
                  "https://www.linkedin.com/company/webtricker",
                  "https://www.pinterest.com/webtricker",
                  "https://www.instagram.com/webtricker",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://webtricker.com/#website",
                name: "Webtricker",
                url: "https://webtricker.com",
                publisher: { "@id": "https://webtricker.com/#organization" },
                inLanguage: "en-US",
              },
            ]),
          }}
        />
      </head>

      <body
        className={`z-0 wt_fs-base ${lato.className} ${lato.variable} ${interTight.variable} ${newsreader.variable} ${plexMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ReduxProvider>
            {children}

            {/* Live chat */}
            {/* <Suspense fallback={null}>
              <LiveChat></LiveChat>
            </Suspense> */}

            {/* Deferred Chat Widgets */}
            <DelayedWidgets />

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
        <SpeedInsights />
      </body>
    </html>
  );
}
