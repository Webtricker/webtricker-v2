// "use client";
// import { portfolios } from "@/data/portfolio";
// import { setFloatingText } from "@/redux/features/dom/floatingDotSlice";
// import Container from "@/sharedComponets/ui/wrapper/Container";
// import { TPortFolioSlider } from "@/types/data";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";

// const Slider = ({ portfolio }: { portfolio: TPortFolioSlider }) => {
//   const dispatch = useDispatch();
//   const { href, img, subTitle, title } = portfolio;
//   return (
//     <div className="block w-full h-[60vh] md:h-screen wt_portfolio-container">
//       <div className="w-full h-full  wt_portfolio-card relative">
//         <Image
//           className="w-full object-cover h-full absolute -z-10"
//           src={img}
//           width={1000}
//           height={800}
//           alt="Portfolio image"
//         />

//         <Link
//           onMouseOverCapture={() => dispatch(setFloatingText("View Demo"))}
//           onMouseLeave={() => dispatch(setFloatingText(null))}
//           href={href}
//           className=" cursor-hide w-full h-full z-10 flex flex-col items-center justify-center"
//         >
//           <div className="w-full overflow-hidden flex items-center justify-center">
//             <h4 className="text-white slide-txt translate-y-full">{subTitle}</h4>
//           </div>
//           <div className="w-full overflow-hidden  flex items-center justify-center">
//             <h2 className=" text-white slide-txt font-semibold wt_fs-7xl 2xl:!text-[160px] translate-y-full">
//               {title}
//             </h2>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default function PortfolioShowcase() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     // Set perspective
//     gsap.set(container.querySelectorAll(".wt_portfolio-container"), {
//       perspective: 60,
//     });

//     // Animate each image
//     const cards = container.querySelectorAll(".wt_portfolio-card");
//     cards.forEach((card) => {
//       gsap.fromTo(
//         card,
//         {
//           rotationX: 1.8,
//           scaleX: 1,
//           z: "0vh",
//         },
//         {
//           rotationX: -0.5,
//           scaleX: 1,
//           z: "-2vh",
//           scrollTrigger: {
//             trigger: card,
//             start: "top+=150px bottom",
//             end: "bottom top",
//             immediateRender: false,
//             scrub: 0.1,
//           },
//         }
//       );
//     });

//     // Animate slide texts when container hits 1/3 of viewport height
//     const textElems = container.querySelectorAll(".slide-txt");
//     textElems.forEach((el) => {
//       gsap.fromTo(
//         el,
//         { y: "100%" },
//         {
//           y: "0%",
//           duration: 1.2,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: el,
//             start: "top 66%",
//             toggleActions: "play none none reverse",
//           },
//         }
//       );
//     });

//     // Cleanup ScrollTriggers
//     return () => {
//       ScrollTrigger.getAll().forEach((t) => t.kill());
//     };
//   }, []);

//   if (!portfolios.length)
//     return <p className="text-center">No portfolio available</p>;
//   return (
//     <section className="w-full overflow-hidden py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
//       <Container>
//         <div ref={containerRef} className="w-full  flex flex-col">
//           {portfolios.length ? (
//             portfolios.map((portfolio) => (
//               <Slider key={portfolio.id} portfolio={portfolio} />
//             ))
//           ) : (
//             <></>
//           )}
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";
import Button from "@/sharedComponets/ui/buttons/Button";
import { TPortfolio } from "@/types/portfolio";
import { formatDate } from "@/utils/date";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

export default function PortfolioShowcase({
  portfolio,
}: {
  portfolio: TPortfolio;
}) {
  const pinContainer = useRef<HTMLDivElement | null>(null);
  const targetElLeft = useRef<HTMLDivElement | null>(null);
  const targetElRight = useRef<HTMLDivElement | null>(null);
  const triggerEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !targetElLeft?.current ||
      !targetElRight?.current ||
      !triggerEl?.current ||
      !pinContainer?.current
    )
      return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 640px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl.current,
          start: "top 79",
          end: "+=100%",
          scrub: true,
          pin: pinContainer.current,
          pinSpacing: true,
        },
      });

      tl.to(targetElLeft.current, { xPercent: -100, ease: "none" }, 0).to(
        targetElRight.current,
        { xPercent: 100, ease: "none" },
        0
      );
    });

    return () => mm.revert(); // cleanup
  }, []);

  return (
    <div className="w-full">
      <div ref={triggerEl} className="w-full h-[0.1px]"></div>
      <div
        ref={pinContainer}
        className="w-full flex flex-col min-h-[700px] sm:h-[calc(100vh-79px)] justify-center grow overflow-hidden"
      >
        <div className="z-0 mx-auto max-w-[600px] relative  w-full sm:w-[30vw] xl:w-[33vw] flex flex-col sm:flex-row items-center grow sm:max-h-[400px]  md:max-h-[450px] lg:max-h-[550px] flex-nowrap px-4 md:px-5 gap-8 justify-between">
          <div
            ref={targetElLeft}
            className="sm:absolute z-30 sm:top-[50%] sm:translate-y-[-50%] left-0 w-full sm:-rotate-2 rounded-[8px] overflow-hidden max-w-[450px] h-full max-h-[550px]"
          >
            <Image
              width={portfolio.thumnail.width}
              height={portfolio.thumnail.height}
              src={portfolio.thumnail.url || ""}
              className="w-full h-full"
              alt="Portfolio image"
            />
          </div>
          <div className="z-10 h-full max-h-[550px] text-center p-2 md:p-5 lg:p-10 flex w-full flex-col gap-5 justify-between items-center">
            <h6 className="uppercase">
              {formatDate(new Date(portfolio.createdAt))}
            </h6>
            <div className="w-full flex flex-col gap-4">
              <h3 className="">{portfolio.title}</h3>
              <Link href={`/portfolio/${portfolio.slug}`}>
                <Button className="!py-3 whitespace-nowrap" label="See More" />
              </Link>
            </div>
            <div className="w-full max-w-[200px] mx-auto h-5 rounded-full bottom-bar"></div>
          </div>
          <div
            ref={targetElRight}
            className="sm:absolute z-20 sm:top-[50%] sm:translate-y-[-50%] right-0 w-full rounded-[8px] overflow-hidden sm:rotate-2 max-w-[450px] h-full max-h-[550px]"
          >
            <Image
              width={portfolio?.coverImage?.width}
              height={portfolio?.coverImage?.height}
              src={portfolio?.coverImage?.url || ""}
              className="w-full h-full"
              alt="Portfolio image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
