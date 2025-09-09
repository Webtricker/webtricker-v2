import ParallaxImage from "@/sharedComponets/ui/parallaxImage/ParallaxImage";
import shortLogo from "@/assets/images/home/webtricker-w.png";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import WhatWeDo from "./components/WhatWeDo";
import TeamInfo from "../(home)/components/TeamInfo";
import FunFacts from "./components/FunFacts";
import Testimonials from "../(home)/components/Testimonials";
import Link from "next/link";
import {
  getAboutPageData,
  getTeamData,
  getTestimonialsData,
} from "@/utils/pageData";
import { ScrollToExploreBtn } from "./components/Button";
import LinkButton from "@/sharedComponets/ui/buttons/LinkButton";
import AboutGallery from "./components/AboutGallery";
import { Metadata } from "next";
import { IAboutPage } from "@/types/pageTypes";

export const revalidate = 120; // page rebuild in every 2 min

export const metadata: Metadata = {
  title: "About Webtricker: Our Mission and Vision | Webtricker",
  description:
    "Discover Webtricker’s mission and vision. We are a responsive web design & development agency creating user-friendly, modern, and SEO-optimized websites.",
  keywords: [
    "about Webtricker",
    "web design agency",
    "web development",
    "mission and vision",
    "responsive websites",
    "SEO-friendly websites",
    "digital agency",
  ],
  authors: [{ name: "Webtricker Team", url: "https://webtricker.com" }],
  creator: "Webtricker",
  publisher: "Webtricker",

  openGraph: {
    type: "website",
    url: "https://webtricker.com/about",
    siteName: "Webtricker",
    title: "About Webtricker: Our Mission and Vision",
    description:
      "Discover Webtricker’s mission and vision. We are a responsive web design & development agency creating user-friendly, modern, and SEO-optimized websites.",
    images: [
      {
        url: "/opengraph-aboutus.jpg",
        width: 1200,
        height: 630,
        alt: "Webtricker - Expert Web Design & Digital Services",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@webtricker",
    title: "About Webtricker: Our Mission and Vision",
    description:
      "Meet Webtricker: a web design & development agency building modern, SEO-friendly, and responsive websites.",
    images: [shortLogo.src],
  },

  alternates: {
    canonical: "https://webtricker.com/about",
  },

  category: "technology",
};

export default async function AboutPage() {
  const teamData = await getTeamData();
  const testimonialsData = await getTestimonialsData();
  const pageData = (await getAboutPageData()) as IAboutPage;

  return (
    <main className="w-full z-0">
      <section
        style={{
          backgroundImage: `url(${pageData?.bannerBackgroundImage})`,
        }}
        className={`flex w-full  h-[140vh]  max-h-[1500px] min-h-[1100px] bg-cover bg-center bg-no-repeat z-0 relative bg-[url(https://liko.foxthemes.me/wp-content/uploads/2024/06/hero-1.jpg)]`}
      >
        <div className="w-full h-full flex-col flex grow bg-black/40">
          <Container className="flex max-w-[1000px] pb-1 flex-col justify-center md:justify-end min-h-[700px]  max-h-[900px] h-[95vh] pt-[100px]">
            <div className="w-full text-white pl-3 lg:pl-4 border-l-2 border-white">
              <h6>{pageData?.bannerIntroText?.top || ""}</h6>
              <h6>{pageData?.bannerIntroText?.bottom || ""}</h6>
            </div>
            <h1 className="!text-white mt-4 !leading-[90%] max-w-[500px] -ml-1 md:-ml-1.5 lg:-ml-2 xl:-ml-2.5 font-semibold tracking-tight">
              {pageData?.bannerLargeText || ""}
            </h1>
            <p className="!text-white wt_text-shadow max-w-[500px] wt_fs-xl bold mt-5">
              {pageData?.bannerDescription || ""}
            </p>
          </Container>
          <div className="w-full">
            <ScrollToExploreBtn text={pageData?.scrollDwonText} />
          </div>
          <Container className="flex justify-end grow items-center">
            <div className="w-full text-white max-w-[600px]">
              <h4>{pageData?.bannerBottomText || ""}</h4>
              <LinkButton className="mt-5" label="Our Story" href="#" />
            </div>
          </Container>
        </div>
      </section>
      <AboutGallery introImages={pageData?.introImages} />
      <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
        <Container>
          <div className="w-full max-w-[1200px]">
            <h3 className="">{pageData?.introText || ""}</h3>
          </div>
        </Container>
      </section>
      <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <Container className="flex lg:items-center gap-12 md:gap-18 xl:gap-20 2xl:gap-28 flex-col lg:flex-row">
          <div className="w-full flex flex-col gap-5 ">
            <div className="w-full">
              <h3 className="heading max-w-[600px] mb-4 !leading-[100%]">
                {pageData?.aboutUsText || ""}
              </h3>
              <p>{pageData?.aboutUsDescription || ""}</p>
            </div>
            <div className="w-full">
              <h4 className="heading md:mb-1">
                {pageData?.ourMissionText || ""}
              </h4>
              <p>{pageData?.ourMissionDescription || ""}</p>
            </div>
            <div className="w-full">
              <h4 className="heading md:mb-1">
                {pageData?.ourGoalsText || ""}
              </h4>
              <p>{pageData?.ourGoalsDescription || ""}</p>
            </div>
            <div className="w-full">
              <h4 className="heading md:mb-1">{pageData?.whyUsText || ""}</h4>
              <p>{pageData?.whyUsDescription || ""}</p>
            </div>
          </div>
          <div className="w-full lg:max-w-[600px] h-auto">
            <ParallaxImage
              src={pageData?.aboutUsImage || ""}
              containerStyle="!rounded-[10px]"
              imgStyle="!rounded-[10px] !object-cover"
            />
          </div>
        </Container>
      </section>

      <WhatWeDo
        whatWeOfferCurveIconBlack={pageData?.whatWeOfferCurveIconBlack}
        whatWeOfferCurveIconWhite={pageData?.whatWeOfferCurveIconWhite}
        whatWeOfferTitle={pageData?.whatWeOfferTitle}
        whatWeOfferSubtitle={pageData?.whatWeOfferSubtitle}
        whatWeOfferItems={pageData?.whatWeOfferItems}
      />
      <TeamInfo title={pageData?.teamInfoTitle || ""} teamData={teamData} />
      <FunFacts aboutUsAnalytics={pageData?.aboutUsAnalytics || {}} />
      <Testimonials
        sectionBg={pageData?.ourClientsSectionBg}
        testimonials={testimonialsData}
      />
      <section className="pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18">
        <Container className="w-full flex flex-col">
          <Link
            data-wt-hide-cursor
            target="_blank"
            href={`mailto:${pageData?.resumeeSendingEmail}`}
            className="bold text-center mb-2 lg:mb-0"
          >
            {pageData?.resumeeSendingText}
          </Link>
          <h2 className="wt_fs-big text-center heading">
            {pageData?.bottomTextLarge || ""}
          </h2>
        </Container>
      </section>
    </main>
  );
}
