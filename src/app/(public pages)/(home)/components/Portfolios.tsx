import ParallaxImage from "@/sharedComponets/ui/parallaxImage/ParallaxLinkImage";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TPortfolio } from "@/types/portfolio";
import React from "react";

export default function Portfolios({
  portfolios = [],
}: {
  portfolios?: TPortfolio[];
}) {
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <Container>
        <div className="w-full flex-col flex-wrap  sm:flex-row flex gap-5 sm:gap-5  lg:gap-14 justify-between overflow-hidden">
          {!!portfolios[0] && (
            <div className="flex items-center w-full sm:w-[45%] 2xl:w-[47%] max-w-[800px] h-auto">
              <ParallaxImage
                containerStyle="w-full  h-[400px] sm:h-[413px] sm:max-w-[600px] shadow-xl dark:shadow-2xl dark:shadow-slate-600"
                href={"/portfolio/" + portfolios[0].slug}
                src={portfolios[0].thumnail.url || ""}
                imgStyle=""
                key={portfolios[0]._id}
              />
            </div>
          )}

          {!!portfolios[1] && (
            <div className="flex w-full sm:w-[45%] 2xl:w-[47%] max-w-[750px] h-auto">
              <ParallaxImage
                containerStyle="w-full h-[400px] sm:h-[500px] md:h-[600px] 2xl:h-[764px] sm:max-w-[600px] shadow-xl dark:shadow-2xl dark:shadow-slate-600"
                href={"/portfolio/" + portfolios[1].slug}
                src={portfolios[1].thumnail.url || ""}
                imgStyle=""
                key={portfolios[1]._id}
              />
            </div>
          )}

          {!!portfolios[2] && (
            <div className="w-full sm:w-[45%] 2xl:w-[47%] flex justify-end max-w-[700px] h-auto">
              <ParallaxImage
                containerStyle="w-full h-[400px] sm:h-[500px] md:h-[550px] 2xl:h-[589px] sm:max-w-[447px] shadow-xl dark:shadow-2xl dark:shadow-slate-600"
                href={"/portfolio/" + portfolios[2].slug}
                src={portfolios[2].thumnail.url || ""}
                imgStyle=""
                key={portfolios[2]._id}
              />
            </div>
          )}

          {!!portfolios[3] && (
            <div className="w-full sm:w-[45%] 2xl:w-[47%] flex items-end justify-center max-w-[800px] h-auto">
              <ParallaxImage
                containerStyle="w-full h-[382px] sm:max-w-[318px] shadow-xl dark:shadow-2xl dark:shadow-slate-600"
                href={"/portfolio/" + portfolios[3].slug}
                src={portfolios[3].thumnail.url || ""}
                imgStyle=""
                key={portfolios[3]._id}
              />
            </div>
          )}

          {!!portfolios[4] && (
            <div className="sm:mt-10 md:mt-20 flex lg:mt-[120px] 2xl:mt-[160px] w-full sm:w-[45%] 2xl:w-[47%] max-w-[800px] h-auto">
              <ParallaxImage
                containerStyle="w-full h-[400px] sm:h-[500px] lg:h-[600px] 2xl:h-[752px] max-w-[596px] shadow-xl dark:shadow-2xl dark:shadow-slate-600"
                href={"/portfolio/" + portfolios[4].slug}
                src={portfolios[4].thumnail.url || ""}
                imgStyle=""
                key={portfolios[4]._id}
              />
            </div>
          )}

          {!!portfolios[5] && (
            <div className="sm:mt-10 md:mt-20 lg:mt-[80px] 2xl:mt-[160px] flex items-start 2xl:pt-20 justify-end w-full sm:w-[45%] 2xl:w-[47%] max-w-[800px] h-auto">
              <ParallaxImage
                containerStyle="w-full h-[382px] lg:h-[449px] max-w-[700px] shadow-xl dark:shadow-2xl dark:shadow-slate-600"
                href={"/portfolio/" + portfolios[5].slug}
                src={portfolios[5].thumnail.url || ""}
                imgStyle=""
                key={portfolios[5]._id}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
