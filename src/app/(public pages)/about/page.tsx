import ParallaxImage from "@/sharedComponets/ui/parallaxImage/ParallaxImage";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import WhatWeDo from "./components/WhatWeDo";
import TeamInfo from "../(home)/components/TeamInfo";
import FunFacts from "./components/FunFacts";
import Testimonials from "../(home)/components/Testimonials";
import Link from "next/link";
import { getTeamData, getTestimonialsData } from "@/utils/pageData";

// export const revalidate = 3600; // page rebuild in every 1 hour
// TODO: have to uncomment above line

// export const revalidate = 300; // page rebuild in every 5 min
export const revalidate = 120; // page rebuild in every 2 min

export default async function AboutPage() {
  const teamData = await getTeamData();
    const testimonialsData = await getTestimonialsData();
  return (
    <main className="w-full z-0">
      <section className={`w-full min-h-screen z-0 flex relative`}>
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] pb-1 text-center bg-slate-800/30 rounded-[10px]">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              About Us
            </h1>
            <p className="!text-white wt_text-shadow wt_fs-xl bold mt-5">
              A leading responsive web design agency creating stunning,
              user-friendly websites.
            </p>
          </div>
        </Container>
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src="/videos/portfolio/portfolio.mp4"
        >
          <source src="/videos/services/banner-intro.mp4" type="video/mp4" />
        </video>
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
