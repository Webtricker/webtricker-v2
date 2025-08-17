import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import PortfoliosContainer from "./components/PortfoliosContainer";
import { getTechnologies } from "@/utils/pageData";

export default async function PortfolioPage() {
  const technologiesData = await getTechnologies();
  return (
    <main className="w-full z-0">
      <section className={`w-full min-h-screen z-0 flex relative`}>
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-2">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              Portfolio
            </h1>
            <p className="!text-white wt_text-shadow wt_fs-xl bold mt-5">
              Explore our portfolio of responsive web design & development
              projects.
            </p>
          </div>
        </Container>
      </section>
      <section className="section-speacing">
        <Container className="!max-w-[1200px]">
          <p className="bold flex items-center gap-1">
            <span>Webtricker Studio</span>
            <span className="w-10 h-[1px] mt-1.5 bg-black dark:bg-white"></span>
          </p>
          <h2 className="heading xl:font-semibold !leading-[100%]">
            Our latest & great projects
          </h2>
          <p className="mx-auto max-w-[500px] mt-5">
            We’re a diverse team that works as fancies attention to details,
            enjoys beers on Friday nights and aspires to design the dent in the
            universe.
          </p>
        </Container>
      </section>
      <PortfoliosContainer technologies={technologiesData} />
      <Container className="w-full flex flex-col">
        <p className="bold text-center mb-2 lg:mb-0">
          DIGITAL DESIGN EXPERIENCE CREATIVE STUDIO
        </p>
        <h2 className="wt_fs-big text-center heading">GET IN TOUCH</h2>
      </Container>
    </main>
  );
}
