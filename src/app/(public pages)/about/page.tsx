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
import { AboutPageBlock, IAboutPage } from "@/types/pageTypes";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";

type AboutRenderContext = {
    pageData: IAboutPage;
    teamData: any[];
    testimonialsData: any[];
};

const buildFallbackSections = (pageData: IAboutPage): AboutPageBlock[] => [
    {
        id: "about-hero",
        type: "aboutHero",
        order: 10,
        visible: true,
        data: {
            bannerIntroText: pageData?.bannerIntroText,
            bannerLargeText: pageData?.bannerLargeText,
            bannerDescription: pageData?.bannerDescription,
            scrollDwonText: pageData?.scrollDwonText,
            bannerBottomText: pageData?.bannerBottomText,
            bannerBottomBtnText: pageData?.bannerBottomBtnText,
            bannerBottomBtnLink: pageData?.bannerBottomBtnLink,
            bannerBackgroundImage: pageData?.bannerBackgroundImage,
        },
    },
    {
        id: "about-gallery",
        type: "aboutGallery",
        order: 20,
        visible: true,
        data: {
            introImages: pageData?.introImages,
        },
    },
    {
        id: "about-intro-text",
        type: "aboutIntroText",
        order: 30,
        visible: true,
        data: {
            introText: pageData?.introText,
        },
    },
    {
        id: "about-story",
        type: "aboutStory",
        order: 40,
        visible: true,
        data: {
            aboutUsText: pageData?.aboutUsText,
            aboutUsDescription: pageData?.aboutUsDescription,
            aboutUsImage: pageData?.aboutUsImage,
            ourMissionText: pageData?.ourMissionText,
            ourMissionDescription: pageData?.ourMissionDescription,
            ourGoalsText: pageData?.ourGoalsText,
            ourGoalsDescription: pageData?.ourGoalsDescription,
            whyUsText: pageData?.whyUsText,
            whyUsDescription: pageData?.whyUsDescription,
        },
    },
    {
        id: "about-what-we-offer",
        type: "whatWeOffer",
        order: 50,
        visible: true,
        data: {
            whatWeOfferTitle: pageData?.whatWeOfferTitle,
            whatWeOfferSubtitle: pageData?.whatWeOfferSubtitle,
            whatWeOfferCurveIconWhite: pageData?.whatWeOfferCurveIconWhite,
            whatWeOfferCurveIconBlack: pageData?.whatWeOfferCurveIconBlack,
            whatWeOfferItems: pageData?.whatWeOfferItems,
        },
    },
    {
        id: "about-team",
        type: "teamSlider",
        order: 60,
        visible: true,
        data: {
            title: pageData?.teamInfoTitle,
        },
    },
    {
        id: "about-fun-facts",
        type: "funFacts",
        order: 70,
        visible: true,
        data: {
            aboutUsAnalytics: pageData?.aboutUsAnalytics,
        },
    },
    {
        id: "about-testimonials",
        type: "testimonialSlider",
        order: 80,
        visible: true,
        data: {
            sectionBg: pageData?.ourClientsSectionBg,
        },
    },
    {
        id: "about-resume-cta",
        type: "resumeCta",
        order: 90,
        visible: true,
        data: {
            resumeeSendingText: pageData?.resumeeSendingText,
            resumeeSendingEmail: pageData?.resumeeSendingEmail,
            bottomTextLarge: pageData?.bottomTextLarge,
        },
    },
];

const getOrderedVisibleSections = (pageData: IAboutPage) => {
    const sections = Array.isArray(pageData?.sections) && pageData.sections.length
        ? pageData.sections
        : buildFallbackSections(pageData);

    return [...sections]
        .filter((section) => section.visible)
        .sort((a, b) => a.order - b.order);
};

function AboutBlockRenderer({
    section,
    context,
}: {
    section: AboutPageBlock;
    context: AboutRenderContext;
}) {
    const { teamData, testimonialsData } = context;
    const data = section.data || {};

    switch (section.type) {
        case "aboutHero":
            return (
                <section
                    style={{
                        backgroundImage: `url(${data?.bannerBackgroundImage})`,
                    }}
                    className={`flex w-full h-screen min-h-[600px] bg-cover bg-center bg-no-repeat z-0 relative`}
                >
                    <div className="w-full h-full flex-col flex bg-black/40 pt-24 pb-8">
                        <Container className="flex max-w-[1000px] flex-col justify-center flex-1">
                            <div className="w-full text-white pl-3 lg:pl-4 border-l-2 border-white">
                                <h6>{data?.bannerIntroText?.top || ""}</h6>
                                <h6>{data?.bannerIntroText?.bottom || ""}</h6>
                            </div>
                            <h1 className="!text-white mt-4 !leading-[90%] max-w-[700px] wt_fs-7xl -ml-1 md:-ml-1.5 lg:-ml-2 xl:-ml-2.5 font-semibold tracking-tight">
                                {data?.bannerLargeText || ""}
                            </h1>
                            <p className="!text-white wt_text-shadow max-w-[500px] wt_fs-xl bold mt-5">
                                {data?.bannerDescription || ""}
                            </p>
                        </Container>
                        <div className="w-full py-4">
                            <ScrollToExploreBtn text={data?.scrollDwonText} />
                        </div>
                        <Container className="flex justify-end items-end">
                            <div className="w-full text-white max-w-[600px]">
                                <h4>{data?.bannerBottomText || ""}</h4>
                                <LinkButton
                                    className="mt-5"
                                    label={data?.bannerBottomBtnText || ""}
                                    href={data?.bannerBottomBtnLink || ""}
                                />
                            </div>
                        </Container>
                    </div>
                </section>
            );
        case "aboutGallery":
            return <AboutGallery introImages={data?.introImages} />;
        case "aboutIntroText":
            return (
                <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
                    <Container>
                        <div className="w-full max-w-[1200px]">
                            <h3 className="">{data?.introText || ""}</h3>
                        </div>
                    </Container>
                </section>
            );
        case "aboutStory":
            return (
                <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
                    <Container className="flex lg:items-center gap-12 md:gap-18 xl:gap-20 2xl:gap-28 flex-col lg:flex-row">
                        <div className="w-full flex flex-col gap-5 ">
                            <div className="w-full">
                                <h3 className="heading max-w-[600px] mb-4 !leading-[100%]">
                                    {data?.aboutUsText || ""}
                                </h3>
                                <p>{data?.aboutUsDescription || ""}</p>
                            </div>
                            <div className="w-full">
                                <h4 className="heading md:mb-1">
                                    {data?.ourMissionText || ""}
                                </h4>
                                <p>{data?.ourMissionDescription || ""}</p>
                            </div>
                            <div className="w-full">
                                <h4 className="heading md:mb-1">
                                    {data?.ourGoalsText || ""}
                                </h4>
                                <p>{data?.ourGoalsDescription || ""}</p>
                            </div>
                            <div className="w-full">
                                <h4 className="heading md:mb-1">
                                    {data?.whyUsText || ""}
                                </h4>
                                <p>{data?.whyUsDescription || ""}</p>
                            </div>
                        </div>
                        <div className="w-full lg:max-w-[600px] h-auto">
                            <ParallaxImage
                                src={data?.aboutUsImage || ""}
                                containerStyle="!rounded-[10px]"
                                imgStyle="!rounded-[10px] !object-cover"
                            />
                        </div>
                    </Container>
                </section>
            );
        case "whatWeOffer":
            return (
                <WhatWeDo
                    whatWeOfferCurveIconBlack={data?.whatWeOfferCurveIconBlack}
                    whatWeOfferCurveIconWhite={data?.whatWeOfferCurveIconWhite}
                    whatWeOfferTitle={data?.whatWeOfferTitle}
                    whatWeOfferSubtitle={data?.whatWeOfferSubtitle}
                    whatWeOfferItems={data?.whatWeOfferItems}
                />
            );
        case "teamSlider":
            return <TeamInfo title={data?.title || ""} teamData={teamData} />;
        case "funFacts":
            return <FunFacts aboutUsAnalytics={data?.aboutUsAnalytics || {}} />;
        case "testimonialSlider":
            return (
                <Testimonials
                    sectionBg={data?.sectionBg}
                    testimonials={testimonialsData}
                />
            );
        case "resumeCta":
            return (
                <section className="pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18">
                    <Container className="w-full flex flex-col">
                        <p className="bold text-center mb-2 lg:mb-0 flex items-center gap-1 justify-center">
                            {data?.resumeeSendingText
                                ?.split(" ")
                                ?.filter((item: string) => !item?.includes("@"))
                                ?.join(" ")}{" "}
                            <Link
                                data-wt-hide-cursor
                                target="_blank"
                                href={`mailto:${data?.resumeeSendingEmail}`}
                                className="text-[var(--clr-darkGold)] underline-[--clr-darkGold] underline flex items-center gap-1"
                            >
                                {data?.resumeeSendingEmail}
                                <ArrowUpRightIcon />
                            </Link>
                        </p>
                        <h2 className="wt_fs-big text-center heading">
                            {data?.bottomTextLarge || ""}
                        </h2>
                    </Container>
                </section>
            );
        default:
            return null;
    }
}

export const metadata: Metadata = {
    title: "About Webtricker: Our Mission and Vision",
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

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 0;

export default async function AboutPage() {
    const teamData = await getTeamData();
    const testimonialsData = await getTestimonialsData();
    const pageData = (await getAboutPageData()) as IAboutPage;
    const sections = getOrderedVisibleSections(pageData);

    return (
        <main className="w-full z-0">
            {sections.map((section) => (
                <AboutBlockRenderer
                    key={section.id}
                    section={section}
                    context={{
                        pageData,
                        teamData,
                        testimonialsData,
                    }}
                />
            ))}
        </main>
        // <></>
    );
}
