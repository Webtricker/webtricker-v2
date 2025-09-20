import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import bannerBg from "@/assets/images/training/training.webp";

export const revalidate = 120;

import shortLogo from "@/assets/images/home/webtricker-w.png"; // optional OG image

export const metadata: Metadata = {
  title: "Explore Our Blog: Ideas and Inspiration",
  description:
    "Read Webtricker’s blog for insights on responsive web design, UI/UX design, website optimization, and digital strategies.",

  keywords: [
    "Webtricker blog",
    "web design insights",
    "UI/UX design tips",
    "website optimization",
    "digital agency blog",
    "web development blog",
  ],

  openGraph: {
    type: "website",
    url: "https://webtricker.com/blogs",
    siteName: "Webtricker",
    title: "Explore Our Blog: Ideas and Inspiration",
    description:
      "Read Webtricker’s blog for insights on responsive web design, UI/UX design, website optimization, and digital strategies.",
    images: [
      {
        url: shortLogo.src, // OG image for blog listing
        width: 1200,
        height: 630,
        alt: "Webtricker - Web Design & Development Agency Blog",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@webtricker", // optional, your brand Twitter handle
    title: "Explore Our Blog: Ideas and Inspiration",
    description:
      "Check out Webtricker’s blog for web design, UI/UX, and optimization tips for modern websites.",
    images: [shortLogo.src],
  },

  alternates: {
    canonical: "https://webtricker.com/blogs",
  },

  category: "technology",
  metadataBase: new URL("https://webtricker.com"),
};
export default async function BlogPage() {
  return (
    <main className="w-full z-0">
      <section
        className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
      >
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              Training
            </h1>
          </div>
        </Container>
        <Image
          title="Click to change background"
          width={1800}
          height={900}
          src={bannerBg?.src}
          className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Service Banner Image"
        />
      </section>

      <section>
        <h3 className="text-center">More Information coming soon...</h3>
      </section>
    </main>
  );
}
