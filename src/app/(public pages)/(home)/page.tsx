import Container from "@/sharedComponets/ui/wrapper/Container";
import Banner from "./components/Banner";
import Clients from "./components/Clients";
import IntroVideo from "./components/IntroVideo";
import Services from "./components/Services";
import LargeMarquee from "./components/LargeMarquee";
import Portfolios from "./components/Portfolios";
import TeamBanner from "./components/TeamBanner";
import Testimonials from "./components/Testimonials";
import TeamInfo from "./components/TeamInfo";
import LatestBlogs from "./components/LatestBlogs";
import { getTeamData, getTestimonialsData } from "@/utils/pageData";

// export const revalidate = 3600; // page rebuild in every 1 hour
// TODO: have to uncomment above line

// export const revalidate = 300; // page rebuild in every 5 min
export const revalidate = 120; // page rebuild in every 5 min

export default async function Home() {
  const teamData = await getTeamData();
  const testimonialsData = await getTestimonialsData();
  return (
    <main className="w-full z-0">
      <Banner />
      <IntroVideo />
      <Container>
        <div className="my-8 md:my-10 w-full border-b border-slate-200 dark:border-slate-800"></div>
      </Container>
      <Clients testimonials={testimonialsData} />
      <Services />
      <LargeMarquee />
      <Portfolios />
      <TeamBanner />
      <Testimonials testimonials={testimonialsData} />
      <TeamInfo teamData={teamData} />
      <LatestBlogs />
    </main>
  );
}
