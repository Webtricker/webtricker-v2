"use client";
import React, { useEffect, useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Container from "@/sharedComponets/ui/wrapper/Container";
import gsap from "gsap";
import { IServicesPage } from "@/types/pageTypes";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children?: React.ReactNode;
  bottomText: IServicesPage["bottomText"];
};
export default function ServicesPanelWrapper({ children, bottomText }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endTrigger = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!containerRef.current || !endTrigger.current) return;

    // ✅ Correct modern GSAP way
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const pinnedPanels =
        containerRef.current?.querySelectorAll<HTMLDivElement>(".service-panel");

      pinnedPanels?.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          endTrigger: endTrigger.current!,
          end: "top bottom",
          pin: true,
          pinSpacing: false,
          id: `${i + 1}`,
        });
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      className="w-full relative pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18"
      ref={containerRef}
    >
      {children}

      <div
        ref={endTrigger}
        className="z-10 w-full pt-10 md:pt-14 lg:pt-18 xl:pt-20 2xl:pt-24"
      >
        <Container className="w-full flex flex-col">
          <p className="bold text-center mb-2 lg:mb-0">
            {bottomText?.expression}
          </p>
          <h2 className="wt_fs-big text-center heading">{bottomText?.title}</h2>
        </Container>
      </div>
    </section>
  );
}
