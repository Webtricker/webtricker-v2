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

export const revalidate = 900;  // page rebuild in every 15 min

export default async function Home() {
  const teamData = await getTeamData();
  const leaderData = await getLeaderData();
  const testimonialsData = await getTestimonialsData();
  const portfoliosData = await getPortfoliosData(12);
  const homeData = await getHomePageData();
  const firstSixPortfolios = portfoliosData.slice(0, 6);
  const secondSixPortfolios = portfoliosData.slice(6, 12);

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
