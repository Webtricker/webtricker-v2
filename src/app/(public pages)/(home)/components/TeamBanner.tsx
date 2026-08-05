"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import galleryModern from "@/app/fonts/gallery";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TTechnology } from "@/types/data";
import { technologies } from "@/data/technology";
import HoverEffectMoveable from "@/sharedComponets/ui/effects/HoverEffectMoveable";

const TechnologyCard = ({ technology }: { technology: TTechnology }) => {
  return (
    <HoverEffectMoveable
    moveAmount={20}
    className=""
    >
      <div className="w-full flex flex-col items-center justify-center ">
        <Image
          className="h-auto w-[60px]"
          src={technology.src}
          width={60}
          height={60}
          alt="Technology icon"
        />
        <p
          className={`font-bold mt-4 tracking-wider ${galleryModern.className}`}
        >
          {technology.name}
        </p>
      </div>
    </HoverEffectMoveable>
  );
};

// root component
export default function TeamBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const endTrigger = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    if (!bannerRef.current || !endTrigger.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: bannerRef.current,
        start: "top top",
        endTrigger: endTrigger.current,
        end: "top top",
        pin: true,
        pinSpacing: false,
        markers: false,
      });
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="w-full pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18"></div>
      <section ref={bannerRef} className="!-z-10">
        <Image
          width={900}
          height={600}
          className="w-full h-screen object-cover"
          src="https://liko.foxthemes.me/wp-content/uploads/2024/06/hero-1-2.jpg"
          alt="Team image"
        />
      </section>
      <section
        ref={endTrigger}
        className="pt-16 lg:pt-24 xl:pt-28 2xl:pt-32 pb-8 md:pb-10 lg:pb-14 xl:pb-16 2xl:pb-18  !z-10"
      >
        <Container>
          <h2 className="heading inline !leading-[100%]">Technology</h2>
          <div className="w-full flex flex-wrap md:flex-nowrap items-end gap-2">
            <h2
              className={`heading !leading-[100%] ${galleryModern.className}`}
            >
              Mastery
            </h2>
            <h6 className="mb-2 md:mb-4 heading">That Delivers Results</h6>
          </div>

          <div className="section-inner-speacing w-full grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 gap-y-10 md:gap-12 2xl:gap-20">
            {technologies.map((item) => (
              <TechnologyCard technology={item} key={item.src} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
