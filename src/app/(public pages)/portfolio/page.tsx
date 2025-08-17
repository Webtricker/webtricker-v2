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
              Explore our portfolio of responsive web design & development projects.
            </p>
          </div>
        </Container>
      </section>
      <PortfoliosContainer technologies={technologiesData} />

      {/* <PortfolioShowcase /> */}

       <Container className="w-full flex flex-col">
            <p className="bold text-center mb-2 lg:mb-0">DIGITAL DESIGN EXPERIENCE CREATIVE STUDIO</p>
          <h2 className="wt_fs-big text-center heading">GET IN TOUCH</h2>
        </Container>
    </main>
  );
}
