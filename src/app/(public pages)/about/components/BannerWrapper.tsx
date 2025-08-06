"use client";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React, { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function BannerWrapper({
  children = <></>,
}: {
  children: ReactNode;
}) {
  // const containerRef = useRef<HTMLDivElement | null>(null);

  // // Laggy effect using ScrollTrigger and GSAP transform
  // useGSAP(
  //   () => {
  //     const elements = containerRef.current?.querySelectorAll("[data-lag]");

  //     elements?.forEach((el) => {
  //       const lag = parseFloat(el.getAttribute("data-lag") || "0.3");

  //       gsap.to(el, {
  //         yPercent: 20 * lag,
  //         ease: "none",
  //         scrollTrigger: {
  //           trigger: el,
  //           start: "bottom bottom",
  //           end: "bottom 30%",
  //           markers:true,
  //           scrub: true,
  //         },
  //       });
  //     });
  //   },
  //   { dependencies: [] }
  // );

  return (
    <div
      // ref={containerRef}
      className="w-full h-full flex-col flex grow bg-black/40 pt-[100px]"
    >
      <Container className="flex flex-col grow">
        {children}
      </Container>
    </div>
  );
}
