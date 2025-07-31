"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function IntroVideo() {
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
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18 relative">
      <div ref={triggerEl} className="w-full h-[0.1px]"></div>
      <div
        ref={pinContainer}
        className="w-full "
      >
        <div ref={targetEl} className="w-full rounded-t-[16px] z-0 max-w-[35vw] overflow-hidden mx-auto">
          <video
            autoPlay
            muted
            loop
            preload="metadata"
            className="h-screen w-full object-cover"
            src="/videos/home/contact.mp4"
          ></video>
        </div>
      </div>
      <div className="w-full h-screen"></div>
    </section>
  );
}
