"use client";
import galleryModern from "@/app/fonts/gallery";
import gsap from "gsap";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

export default function LargeMarquee() {
  const marQueeContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!marQueeContainer?.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Smaller than 576px
      mm.add("(max-width: 575px)", () => {
        gsap.to(marQueeContainer.current, {
          x: "-200%",
          scrollTrigger: {
            trigger: marQueeContainer.current,
            start: "top bottom",
            end: "+=100% top",
            scrub: true,
          },
        });
      });

      // Small (576px - 767px)
      mm.add("(min-width: 576px) and (max-width: 767px)", () => {
        gsap.to(marQueeContainer.current, {
          x: "-150%",
          scrollTrigger: {
            trigger: marQueeContainer.current,
            start: "top bottom",
            end: "+=100% top",
            scrub: true,
          },
        });
      });

      // Medium (768px - 1023px)
      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        gsap.to(marQueeContainer.current, {
          x: "-110%",
          scrollTrigger: {
            trigger: marQueeContainer.current,
            start: "top bottom",
            end: "+=100% top",
            scrub: true,
          },
        });
      });

      // Large (1024px and up)
      mm.add("(min-width: 1024px)", () => {
        gsap.to(marQueeContainer.current, {
          x: "-70%",
          scrollTrigger: {
            trigger: marQueeContainer.current,
            start: "top bottom",
            end: "+=100% top",
            scrub: true,
          },
        });
      });
    }, marQueeContainer);


    return () => ctx.revert();
  }, []);
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <div className="w-full overflow-hidden">
        <div ref={marQueeContainer} className="w-full flex flex-nowrap">
          <h2 className={`heading wt_fs-giant flex flex-nowrap whitespace-nowrap items-center gap-2 md:gap-5`}>
            <span className="-mt-3">ECT </span><span className="ml-1 md:ml-5 lg:ml-10 inline-block"></span>
            <span className={galleryModern.className}>CO</span>
            <Image
              className="wt_infinit_spin 2xl:w-[137px] xl:w-[110px] lg:w-[100px] md:w-[90px] sm:w-[72px] w-16"
              src="https://liko.foxthemes.me/wp-content/uploads/2024/06/project-shape-1-1.png"
              width={137}
              height={137}
              alt="Brand image"
            />
            <span className={galleryModern.className}>LEST</span>{" "}
            <span className="ml-1 md:ml-5 lg:ml-10 inline-block"></span>
            <span className="-mt-3">PROJECT</span><span className="ml-1 md:ml-5 lg:ml-10 inline-block"></span>
            <span className={galleryModern.className}>CO</span>
            <Image
              className="wt_infinit_spin 2xl:w-[137px] xl:w-[110px] lg:w-[100px] md:w-[90px] sm:w-[72px] w-16"
              src="https://liko.foxthemes.me/wp-content/uploads/2024/06/project-shape-1-1.png"
              width={137}
              height={137}
              alt="Brand image"
            />
            <span className={galleryModern.className}>LEST</span>
            <span className="ml-1 md:ml-5 lg:ml-10 inline-block"></span> <span className="-mt-3">PROJECT</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
