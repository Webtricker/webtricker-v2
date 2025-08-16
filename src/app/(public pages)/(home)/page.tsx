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

export const revalidate = 900; // page rebuild in every 15 min

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
