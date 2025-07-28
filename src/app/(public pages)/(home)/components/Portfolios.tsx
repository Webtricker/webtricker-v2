import LinkButton from "@/sharedComponets/ui/buttons/LinkButton";
import ParallaxImage from "@/sharedComponets/ui/parallaxImage/ParallaxLinkImage";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";

export default function Portfolios() {
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <Container>
        <div className="w-full flex-col flex-wrap  sm:flex-row flex gap-5 sm:gap-5  lg:gap-14 justify-between overflow-hidden">
          <div className="flex items-center w-full sm:w-[45%] 2xl:w-[47%] max-w-[800px] h-auto">
            <ParallaxImage
              containerStyle="w-full  h-[400px] sm:h-[413px] sm:max-w-[600px]"
              href=""
              src="/images/portfolios/bicycle.png"
              imgStyle=""
              key="/images/portfolios/bicycle.png"
            />
          </div>
          <div className="flex w-full sm:w-[45%] 2xl:w-[47%] max-w-[750px] h-auto">
            <ParallaxImage
              containerStyle="w-full h-[400px] sm:h-[500px] md:h-[600px] 2xl:h-[764px] sm:max-w-[600px]"
              href=""
              src="/images/portfolios/brilliant-glass.png"
              imgStyle=""
              key="/images/portfolios/brilliant-glass.png"
            />
          </div>
          <div className="w-full sm:w-[45%] 2xl:w-[47%] flex justify-end max-w-[700px] h-auto">
            <ParallaxImage
              containerStyle="w-full h-[400px] sm:h-[500px] md:h-[550px] 2xl:h-[589px] sm:max-w-[447px]"
              href=""
              src="/images/portfolios/bus-bank.png"
              imgStyle=""
              key="/images/portfolios/bus-bank.png"
            />
          </div>
          <div className="w-full sm:w-[45%] 2xl:w-[47%] flex items-end justify-center max-w-[800px] h-auto">
            <ParallaxImage
              containerStyle="w-full h-[382px] sm:max-w-[318px]"
              href=""
              src="/images/portfolios/clicky.png"
              imgStyle=""
              key="/images/portfolios/clicky.png"
            />
          </div>

          <div className="sm:mt-10 md:mt-20 flex lg:mt-[120px] 2xl:mt-[160px] w-full sm:w-[45%] 2xl:w-[47%] max-w-[800px] h-auto">
            <ParallaxImage
              containerStyle="w-full h-[400px] sm:h-[500px] lg:h-[600px] 2xl:h-[752px] max-w-[596px]"
              href=""
              src="/images/portfolios/legend-minning.png"
              imgStyle=""
              key="/images/portfolios/legend-minning.png"
            />
          </div>
          <div className="sm:mt-10 md:mt-20 lg:mt-[80px] 2xl:mt-[160px] flex items-start 2xl:pt-20 justify-end w-full sm:w-[45%] 2xl:w-[47%] max-w-[800px] h-auto">
            <ParallaxImage
              containerStyle="w-full h-[382px] lg:h-[449px] max-w-[700px]"
              href=""
              src="/images/portfolios/car-shoorom.png"
              imgStyle=""
              key="/images/portfolios/car-shoorom.png"
            />
          </div>
          <div className="hidden sm:block w-full sm:w-[45%] 2xl:w-[47%] "></div>
          <div className="w-full sm:w-[45%] 2xl:w-[47%] sm:-mt-20 lg:-mt-24">
            <LinkButton
              className=""
              label="View All Projects"
              href="/services"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
