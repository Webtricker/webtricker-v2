import ParallaxImage from "@/sharedComponets/ui/parallaxImage/ParallaxImage";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import WhatWeDo from "./components/WhatWeDo";
import TeamInfo from "../(home)/components/TeamInfo";
import FunFacts from "./components/FunFacts";
import Testimonials from "../(home)/components/Testimonials";
import Link from "next/link";
import { getTeamData, getTestimonialsData } from "@/utils/pageData";
import { ScrollToExploreBtn } from "./components/Button";
import LinkButton from "@/sharedComponets/ui/buttons/LinkButton";
import AboutGallery from "./components/AboutGallery";

// export const revalidate = 3600; // page rebuild in every 1 hour
// TODO: have to uncomment above line

// export const revalidate = 300; // page rebuild in every 5 min
export const revalidate = 120; // page rebuild in every 2 min

export default async function AboutPage() {
  const teamData = await getTeamData();
  const testimonialsData = await getTestimonialsData();

  // TODO: have to change the banner background image
  return (
    <main className="w-full z-0">
      <section
        className={`flex w-full  h-[140vh]  max-h-[1500px] min-h-[1100px] bg-cover bg-center bg-no-repeat z-0 relative bg-[url(https://liko.foxthemes.me/wp-content/uploads/2024/06/hero-1.jpg)]`}
      >
        <div className="w-full h-full flex-col flex grow bg-black/40">
          <Container className="flex max-w-[1000px] pb-1 flex-col justify-center md:justify-end min-h-[700px]  max-h-[900px] h-[95vh] pt-[100px]">
            <div className="w-full text-white pl-3 lg:pl-4 border-l-2 border-white">
              <h6>DIGITAL</h6>
              <h6>CREATIVE AGENCY</h6>
            </div>
            <h1 className="!text-white mt-4 !leading-[90%] max-w-[500px] -ml-1 md:-ml-1.5 lg:-ml-2 xl:-ml-2.5 font-semibold tracking-tight">
              Building Digital Presence
            </h1>
            <p className="!text-white wt_text-shadow max-w-[500px] wt_fs-xl bold mt-5">
              A leading responsive web design agency creating stunning,
              user-friendly websites.
            </p>
          </Container>
          <div className="w-full">
            <ScrollToExploreBtn />
          </div>
          <Container className="flex justify-end grow items-center">
            <div className="w-full text-white max-w-[600px]">
              <h4>
                Liko develops, designs & delivers websites & creative campaigns
                that drive results,
              </h4>
              <LinkButton className="mt-5" label="Our Story" href="#" />
            </div>
          </Container>
        </div>
      </section>
      <AboutGallery />
      <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
        <Container>
          <div className="w-full max-w-[1200px]">
            <h3 className="">
              We are a creative studio that specializes in providing
              high-quality design and branding solutions to businesses and
              individuals. Our team is composed of talented designers,
              developers, and marketers.!
            </h3>
          </div>
        </Container>
      </section>
      <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <Container className="flex lg:items-center gap-12 md:gap-18 xl:gap-20 2xl:gap-28 flex-col lg:flex-row">
          <div className="w-full flex flex-col gap-5 ">
            <div className="w-full">
              <h3 className="heading max-w-[600px] mb-4 !leading-[100%]">
                We help to make your website creative
              </h3>
              <p>
                Webtricker Web Design & Development Agency is a total solution
                of your website related requirements. From branding to web
                design and then web design to web development. And finally
                deploy to the hosting. We do everything as one stop service
                center.
              </p>
            </div>
            <div className="w-full">
              <h4 className="heading md:mb-1">Our mission</h4>
              <p>
                Being professional in web development, mobile application, and
                digital marketing companies. Our mission is to provide
                customer-centric, result-oriented, cost-competitive innovative &
                functional IT Solutions to our valuable global clients
              </p>
            </div>
            <div className="w-full">
              <h4 className="heading md:mb-1">Our goals</h4>
              <p>
                We are focused on providing your users the BEST experience they
                can have on your website. We love creating UNIQUE, ELEGANT and
                USABLE websites built on solid web standards.
              </p>
            </div>
            <div className="w-full">
              <h4 className="heading md:mb-1">Why us?</h4>
              <p>
                One of the first things you should know about us is that we
                don’t do everything. But what we do, we do well. We always try
                to value our clients time and money. Let us prove it by
                involving us with you with any of the following services.
                We&apos;d be happy to serve you with our maximum effort.
              </p>
            </div>
          </div>
          <div className="w-full lg:max-w-[600px] h-auto">
            <ParallaxImage
              src="/images/about-us/mosharraf-speaking.webp"
              containerStyle="!rounded-[10px]"
              imgStyle="!rounded-[10px] !object-cover"
            />
          </div>
        </Container>
      </section>

      <WhatWeDo />
      <TeamInfo teamData={teamData} />
      <FunFacts />
      <Testimonials testimonials={testimonialsData} />
      <section className="pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18">
        <Container className="w-full flex flex-col">
          <p className="bold text-center mb-2 lg:mb-0">
            SEND YOUR RESUME TO{" "}
            <Link
              data-wt-hide-cursor
              target="_blank"
              href="mailto:career@webtricker.com"
            >
              career@webtricker.com
            </Link>
          </p>
          <h2 className="wt_fs-big text-center heading">JOIN US</h2>
        </Container>
      </section>
    </main>
  );
}
