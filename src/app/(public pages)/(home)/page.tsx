import Container from "@/sharedComponets/ui/wrapper/Container";
// import Banner from "./components/Banner";
import Clients from "./components/Clients";
// import IntroVideo from "./components/IntroVideo";
import Services from "./components/Services";
import LargeMarquee from "./components/LargeMarquee";
import Portfolios from "./components/Portfolios";
import Testimonials from "./components/Testimonials";
import TeamInfo from "./components/TeamInfo";
import LatestBlogs from "./components/LatestBlogs";
import {
  getHomePageData,
  getLeaderData,
  getPortfoliosData,
  getTeamData,
  getTestimonialsData,
} from "@/utils/pageData";
import PortfolioSlider from "./components/PortfolioSlider";
import OurLeader from "./components/OurLeader";
import InstragramFeed from "./components/InstragramFeed";
import Technologies from "./components/Technologies";
import { Metadata } from "next";
import Banner from "./components/Banner";
import IntroVideo from "./components/IntroVideo";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Expert Web Design & Digital Services | Home",
  description:
    "We are Webtricker, specializing in responsive web design and development. Delivering pixel-perfect, high-quality websites for our valued clients.",
  keywords: [
    "Expert Web Design & Digital Services",
    "web development company",
    "pixel-perfect  websites",
    "Best web development services",
    "Best web design services in bangladesh",
    "Best bangladeshi web development company",
  ],
  openGraph: {
    description:
      "Get premium responsive web design for a stunning, seamless website on all devices.",
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

  const firstSixPortfolios = portfoliosData?.slice(0, 6);
  const secondSixPortfolios = portfoliosData?.slice(6, 12);

  return (
    <main className="w-full z-0">
      <Banner homeData={homeData} />
      <IntroVideo homeData={homeData} />
      <Container>
        <div className="my-8 md:my-10 w-full border-b border-slate-200 dark:border-slate-800"></div>
      </Container>
      <Clients
        title={homeData?.clientSectionSubtitle}
        clientsBanners={homeData?.clientsBanners}
      />
      <Testimonials
        sectionBg={homeData?.testimonialsBg}
        testimonials={testimonialsData}
      />
      <Technologies technologies={homeData?.technologies} />
      <Services
        allServiceTxt={homeData?.allServiceBtnText}
        serviceSectionTitle={homeData?.serviceSectionTitle}
      />
      <LargeMarquee />
      <Portfolios portfolios={firstSixPortfolios} />

      {secondSixPortfolios?.length > 5 ? (
        <PortfolioSlider
          linkText={homeData?.allProjectBtnText}
          portfolios={secondSixPortfolios}
        />
      ) : (
        <></>
      )}
      <OurLeader
        leaderData={leaderData}
        title={homeData?.leadersSectionTitle}
      />
      <TeamInfo title={homeData?.teamSectionTitle} teamData={teamData} />
      <LatestBlogs blogSectionTitle={homeData?.blogSectionTitle} />
      <InstragramFeed images={homeData?.bottomSlider} />
    </main>
  );
}
