import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import PortfoliosContainer from "./components/PortfoliosContainer";
import { getTechnologies } from "@/utils/pageData";
import PortfolioBanner from "./components/PortfolioBanner";

export default async function PortfolioPage() {
  const technologiesData = await getTechnologies();
  return (
    <main className="w-full z-0">
      <PortfolioBanner
        images={[
          "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F1.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F2.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F3.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F4.jpg?alt=media",
          "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F5.jpg?alt=media",
        ]}
        imageDuration={8000}
        rows={4}
        cols={7}
      />

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
