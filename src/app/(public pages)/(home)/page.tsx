import Container from "@/sharedComponets/ui/wrapper/Container";
import Banner from "./components/Banner";
import Clients from "./components/Clients";
import IntroVideo from "./components/IntroVideo";
import Services from "./components/Services";
import LargeMarquee from "./components/LargeMarquee";
import Portfolios from "./components/Portfolios";
import Testimonials from "./components/Testimonials";
import TeamInfo from "./components/TeamInfo";
import LatestBlogs from "./components/LatestBlogs";
import {
  getPortfoliosData,
  getTeamData,
  getTestimonialsData,
} from "@/utils/pageData";
import PortfolioSlider from "./components/PortfolioSlider";
import OurLeader from "./components/OurLeader";
import InstragramFeed from "./components/InstragramFeed";
import { Metadata } from "next";
import shortLogo from "@/assets/images/home/webtricker-w.png";

export const revalidate = 900; // page rebuild in every 15 min

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
    title: "Webtricker - Expert Web Design & Digital Services",
    description:
      "Get premium responsive web design for a stunning, seamless website on all devices.",
    url: "https://webtricker.com",
    images: [
      {
        url: `${shortLogo.src}`,
        width: 1200,
        height: 630,
        alt: "Webtricker - Expert Web Design & Digital Services",
      },
    ],
    siteName: "Webtricker",
    type: "website",
  },
};

export default async function Home() {
  const teamData = await getTeamData();
  const testimonialsData = await getTestimonialsData();
  const portfoliosData = await getPortfoliosData(12);

  const firstSixPortfolios = portfoliosData.slice(0, 6);
  const secondSixPortfolios = portfoliosData.slice(6, 12);
  return (
    <main className="w-full z-0">
      <Banner />
      <IntroVideo />
      <Container>
        <div className="my-8 md:my-10 w-full border-b border-slate-200 dark:border-slate-800"></div>
      </Container>
      <Clients testimonials={testimonialsData} />
      <Testimonials testimonials={testimonialsData} />
      <Services />
      <LargeMarquee />
      <Portfolios portfolios={firstSixPortfolios} />

      {secondSixPortfolios.length > 5 ? (
        <PortfolioSlider portfolios={secondSixPortfolios} />
      ) : (
        <></>
      )}
      <OurLeader />
      <TeamInfo teamData={teamData} />
      <LatestBlogs />
      <InstragramFeed />
    </main>
  );
}
