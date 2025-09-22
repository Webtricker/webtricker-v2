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
import LazyLoadSection from "@/sharedComponets/DOM/LazyLoadSection";

// sections
import Clients from "./components/Clients";
import Services from "./components/Services";
import LargeMarquee from "./components/LargeMarquee";
import Portfolios from "./components/Portfolios";
import Testimonials from "./components/Testimonials";
import TeamInfo from "./components/TeamInfo";
import LatestBlogs from "./components/LatestBlogs";
import PortfolioSlider from "./components/PortfolioSlider";
import OurLeader from "./components/OurLeader";
import InstragramFeed from "./components/InstragramFeed";
import Technologies from "./components/Technologies";

export const revalidate = 120;

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

  const firstSixPortfolios = portfoliosData?.slice(0, 6);
  const secondSixPortfolios = portfoliosData?.slice(6, 12);

  return (
    <main className="w-full z-0">
      {/* above the fold */}
      <Banner homeData={homeData} />
      <IntroVideo homeData={homeData} />

      <Container>
        <div className="my-8 md:my-10 w-full border-b border-slate-200 dark:border-slate-800"></div>
      </Container>

      {/* lazy loaded sections */}
      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <Clients
          title={homeData?.clientSectionSubtitle}
          clientsBanners={homeData?.clientsBanners}
        />
      </LazyLoadSection>

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <Testimonials
          sectionBg={homeData?.testimonialsBg}
          testimonials={testimonialsData}
        />
      </LazyLoadSection>

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <Technologies technologies={homeData?.technologies} />
      </LazyLoadSection>

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <Services
          allServiceTxt={homeData?.allServiceBtnText}
          serviceSectionTitle={homeData?.serviceSectionTitle}
        />
      </LazyLoadSection>

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <LargeMarquee />
      </LazyLoadSection>

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <Portfolios portfolios={firstSixPortfolios} />
      </LazyLoadSection>

      {secondSixPortfolios?.length > 5 && (
        <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
          <PortfolioSlider
            linkText={homeData?.allProjectBtnText}
            portfolios={secondSixPortfolios}
          />
        </LazyLoadSection>
      )}

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <OurLeader
          leaderData={leaderData}
          title={homeData?.leadersSectionTitle}
        />
      </LazyLoadSection>

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <TeamInfo title={homeData?.teamSectionTitle} teamData={teamData} />
      </LazyLoadSection>

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <LatestBlogs blogSectionTitle={homeData?.blogSectionTitle} />
      </LazyLoadSection>

      <LazyLoadSection rootMargin="200px" placeholderStyle={"min-h-[558px]"} >
        <InstragramFeed images={homeData?.bottomSlider} />
      </LazyLoadSection>
    </main>
  );
}
