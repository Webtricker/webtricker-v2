"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { IHomePage } from "@/types/pageTypes";
import Image from "next/image";

export default function IntroVideo({ homeData }: { homeData: IHomePage }) {
  const pinContainer = useRef<HTMLDivElement | null>(null);
  const targetEl = useRef<HTMLDivElement | null>(null);
  const triggerEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetEl?.current || !triggerEl?.current || !pinContainer?.current)
      return;

    const ctx = gsap.context(() => {
      gsap.to(targetEl.current, {
        maxWidth: "100vw",
        scrollTrigger: {
          trigger: triggerEl.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
          //   markers: true,
          pinSpacing: false,
          pin: pinContainer.current,
        },
      });
    }, targetEl);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18 relative hidden md:block">
      <div ref={triggerEl} className="w-full h-[0.1px]"></div>
      <div ref={pinContainer} className="w-full ">
        <div
          ref={targetEl}
          className="w-full rounded-t-[16px] z-0 max-w-[35vw] overflow-hidden mx-auto"
        >
          <Image
            width={270}
            height={160}
            decoding="async"
            className={`${homeData?.introVideo?.type === "image" ? "block " : 'hidden '} h-screen max-h-screen w-full object-cover`}
            src={homeData?.introVideo?.src || ""}
            alt="Intro image"
          />
          <video
            autoPlay
            muted
            loop
            className={`${homeData?.introVideo?.type === "video" ? "block " : 'hidden '} h-screen max-h-screen w-full object-cover`}
            src={homeData?.introVideo?.src}
          ></video>
        </div>
      </div>
      <div className="w-full h-screen"></div>
    </section>
  );
}
