import dynamic from "next/dynamic";
import Container from "@/sharedComponets/ui/wrapper/Container";
import {
  getHomePageData,
  getLeaderData,
  getPortfoliosData,
  getTeamData,
  getTestimonialsData,
} from "@/utils/pageData";
import { Metadata } from "next";

// above-the-fold components (load instantly)
import Banner from "./components/Banner";
import IntroVideo from "./components/IntroVideo";

// lazy-load wrapper
import LazyLoadSection, { LoadingPlaceholder } from "@/sharedComponets/DOM/LazyLoadSection";
import { HomePageBlock, IHomePage } from "@/types/pageTypes";

// sections
const Clients = dynamic(() => import("./components/Clients"), {
  loading: () => <LoadingPlaceholder />,
});


const Services = dynamic(() => import("./components/Services"), {
  loading: () => <LoadingPlaceholder />,
});

const LargeMarquee = dynamic(() => import("./components/LargeMarquee"), {
  loading: () => <LoadingPlaceholder />,
});

const Portfolios = dynamic(() => import("./components/Portfolios"), {
  loading: () => <LoadingPlaceholder />,
});

const Testimonials = dynamic(() => import("./components/Testimonials"), {
  loading: () => <LoadingPlaceholder />,
});

const TeamInfo = dynamic(() => import("./components/TeamInfo"), {
  loading: () => <LoadingPlaceholder />,
});

const LatestBlogs = dynamic(() => import("./components/LatestBlogs"), {
  loading: () => <LoadingPlaceholder />,
});

const PortfolioSlider = dynamic(() => import("./components/PortfolioSlider"), {
  loading: () => <div className="h-48 bg-gray-200 animate-pulse rounded-lg" />,
});

const OurLeader = dynamic(() => import("./components/OurLeader"), {
  loading: () => <LoadingPlaceholder />,
});

const InstragramFeed = dynamic(() => import("./components/InstragramFeed"), {
  loading: () => <LoadingPlaceholder />,
});

const Technologies = dynamic(() => import("./components/Technologies"), {
  loading: () => <LoadingPlaceholder />,
});

type HomeRenderContext = {
  homeData: IHomePage;
  testimonialsData: any[];
  portfoliosData: any[];
  leaderData: any[];
  teamData: any[];
};

const lazyPlaceholderStyle = "min-h-[558px]";

const buildFallbackSections = (homeData: IHomePage): HomePageBlock[] => [
  {
    id: "home-hero",
    type: "hero",
    order: 10,
    visible: true,
    data: {
      greeting: homeData?.greeting,
      bannerText: homeData?.bannerText,
      bannerSpinningIconWhite: homeData?.bannerSpinningIconWhite,
      bannerSpinningIconBlack: homeData?.bannerSpinningIconBlack,
      bannerVideo: homeData?.bannerVideo,
      bannerDescription: homeData?.bannerDescription,
    },
  },
  {
    id: "home-media-intro",
    type: "mediaIntro",
    order: 20,
    visible: true,
    data: {
      introVideo: homeData?.introVideo,
    },
  },
  {
    id: "home-logo-marquee",
    type: "logoMarquee",
    order: 30,
    visible: true,
    data: {
      title: homeData?.clientSectionSubtitle,
      clientsBanners: homeData?.clientsBanners,
    },
  },
  {
    id: "home-testimonials",
    type: "testimonialSlider",
    order: 40,
    visible: true,
    data: {
      sectionBg: homeData?.testimonialsBg,
    },
  },
  {
    id: "home-technologies",
    type: "technologyGrid",
    order: 50,
    visible: true,
    data: {
      technologies: homeData?.technologies,
    },
  },
  {
    id: "home-services",
    type: "collectionPreview",
    order: 60,
    visible: true,
    data: {
      variant: "homeServices",
      serviceSectionTitle: homeData?.serviceSectionTitle,
      allServiceBtnText: homeData?.allServiceBtnText,
    },
  },
  {
    id: "home-large-marquee",
    type: "marquee",
    order: 70,
    visible: true,
    data: {
      variant: "largeMarquee",
    },
  },
  {
    id: "home-portfolio-showcase",
    type: "portfolioShowcase",
    order: 80,
    visible: true,
    data: {
      range: { start: 0, end: 6 },
    },
  },
  {
    id: "home-portfolio-slider",
    type: "portfolioSlider",
    order: 90,
    visible: true,
    data: {
      range: { start: 6, end: 12 },
      visibleWhen: {
        secondSixPortfoliosLengthGreaterThan: 5,
      },
      linkText: homeData?.allProjectBtnText,
    },
  },
  {
    id: "home-leaders",
    type: "leaderGrid",
    order: 100,
    visible: true,
    data: {
      title: homeData?.leadersSectionTitle,
    },
  },
  {
    id: "home-team",
    type: "teamSlider",
    order: 110,
    visible: true,
    data: {
      title: homeData?.teamSectionTitle,
    },
  },
  {
    id: "home-latest-blogs",
    type: "collectionPreview",
    order: 120,
    visible: true,
    data: {
      variant: "latestBlogs",
      blogSectionTitle: homeData?.blogSectionTitle,
    },
  },
  {
    id: "home-image-feed",
    type: "imageFeed",
    order: 130,
    visible: true,
    data: {
      images: homeData?.bottomSlider,
    },
  },
];

const getOrderedVisibleSections = (homeData: IHomePage) => {
  const sections = Array.isArray(homeData?.sections) && homeData.sections.length
    ? homeData.sections
    : buildFallbackSections(homeData);

  return [...sections]
    .filter((section) => section.visible)
    .sort((a, b) => a.order - b.order);
};

function HomeBlockRenderer({
  section,
  context,
}: {
  section: HomePageBlock;
  context: HomeRenderContext;
}) {
  const { homeData, testimonialsData, portfoliosData, leaderData, teamData } =
    context;
  const data = section.data || {};
  const blockHomeData = { ...homeData, ...data };
  const range = data.range || {};
  const portfolioStart = Number.isFinite(range.start) ? range.start : 0;
  const portfolioEnd = Number.isFinite(range.end) ? range.end : 6;

  switch (section.type) {
    case "hero":
      return <Banner homeData={blockHomeData} />;
    case "mediaIntro":
      return (
        <>
          <IntroVideo homeData={blockHomeData} />
          <Container>
            <div className="my-8 md:my-10 w-full border-b border-slate-200 dark:border-slate-800"></div>
          </Container>
        </>
      );
    case "logoMarquee":
      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <Clients title={data.title} clientsBanners={data.clientsBanners} />
        </LazyLoadSection>
      );
    case "testimonialSlider":
      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <Testimonials
            sectionBg={data.sectionBg}
            testimonials={testimonialsData}
          />
        </LazyLoadSection>
      );
    case "technologyGrid":
      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <Technologies technologies={data.technologies} />
        </LazyLoadSection>
      );
    case "collectionPreview":
      if (data.variant === "latestBlogs") {
        return (
          <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
            <LatestBlogs blogSectionTitle={data.blogSectionTitle} />
          </LazyLoadSection>
        );
      }

      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <Services
            allServiceTxt={data.allServiceBtnText}
            serviceSectionTitle={data.serviceSectionTitle}
          />
        </LazyLoadSection>
      );
    case "marquee":
      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <LargeMarquee />
        </LazyLoadSection>
      );
    case "portfolioShowcase":
      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <Portfolios
            portfolios={portfoliosData?.slice(portfolioStart, portfolioEnd)}
          />
        </LazyLoadSection>
      );
    case "portfolioSlider": {
      const portfolios = portfoliosData?.slice(portfolioStart, portfolioEnd);
      const shouldShow =
        !data.visibleWhen?.secondSixPortfoliosLengthGreaterThan ||
        portfolios?.length > 5;

      if (!shouldShow) return null;

      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <PortfolioSlider linkText={data.linkText} portfolios={portfolios} />
        </LazyLoadSection>
      );
    }
    case "leaderGrid":
      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <OurLeader leaderData={leaderData} title={data.title} />
        </LazyLoadSection>
      );
    case "teamSlider":
      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <TeamInfo title={data.title} teamData={teamData} />
        </LazyLoadSection>
      );
    case "imageFeed":
      return (
        <LazyLoadSection placeholderStyle={lazyPlaceholderStyle}>
          <InstragramFeed images={data.images} />
        </LazyLoadSection>
      );
    default:
      return null;
  }
}

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Expert Web Design & Digital Services",
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

export default async function Home() {
  const [teamData, leaderData, testimonialsData, portfoliosData, homeData] =
    await Promise.all([
      getTeamData(),
      getLeaderData(),
      getTestimonialsData(),
      getPortfoliosData(12),
      getHomePageData(),
    ]);

  const sections = getOrderedVisibleSections(homeData as IHomePage);

  return (
    <main className="w-full z-0">
      {sections.map((section) => (
        <HomeBlockRenderer
          key={section.id}
          section={section}
          context={{
            homeData: homeData as IHomePage,
            testimonialsData,
            portfoliosData,
            leaderData,
            teamData,
          }}
        />
      ))}
    </main>
  );
}
