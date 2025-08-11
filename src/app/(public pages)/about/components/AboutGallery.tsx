"use client";
import Container from "@/sharedComponets/ui/wrapper/Container";
import gsap from "gsap";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

export default function AboutGallery() {
  const longImageRef = useRef<HTMLImageElement | null>(null);
  const mediumImageRef = useRef<HTMLImageElement | null>(null);
  const shortImageRef = useRef<HTMLImageElement | null>(null);
  //   const parentContainerRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    console.log(longImageRef, " image ref");
    if (!longImageRef.current || !mediumImageRef.current || !shortImageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        longImageRef.current,
        { y: "-20%" },
        {
          y: "40%",
          ease: "none",
          scrollTrigger: {
            trigger: longImageRef.current,
            start: "30% 90%",
            end: "bottom -10%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        mediumImageRef.current,
        { y: "-5%" },
        {
          y: "30%",
          ease: "none",
          scrollTrigger: {
            trigger: mediumImageRef.current,
            start: "0% 100%",
            end: "bottom -10%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        shortImageRef.current,
        { y: "0%" },
        {
          y: "-40%",
          ease: "none",
          scrollTrigger: {
            trigger: shortImageRef.current,
            start: "0% 100%",
            end: "bottom 0%",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert(); // clean up on unmount
  }, []);
  return (
    <section className="section-speacing">
      <div className="w-full section-inner-speacing"></div>
      <Container className="flex">
        <div className="w-full flex items-center flex-col md:flex-row gap-10 lg:gap-20 justify-between">
          <div className="w-full max-w-[600px] relative h-[350px] md:h-[400px] lg:h-[428px]">
            <div className="w-full h-[400px] md:h-[550px] xl:h-[690px] overflow-hidden absolute left-0 bottom-0">
              <Image
                ref={longImageRef}
                width={600}
                height={900}
                className="w-full h-[135%] absolute left-0 bottom-0"
                src="https://liko.foxthemes.me/wp-content/uploads/2024/06/about-1.jpg"
                alt="Gallery Image 1"
              />
            </div>
          </div>
          <div className="w-full relative flex justify-center">
            <div className="w-full max-w-[638px] h-[400px] lg:h-[428px] relative">
              <Image
                ref={mediumImageRef}
                width={638}
                height={428}
                className="w-full h-full absolute top-0 left-0"
                src="https://liko.foxthemes.me/wp-content/uploads/2024/06/about-2.jpg"
                alt="Gallery Image"
              />
            </div>

            <div className="w-full absolute -bottom-[40%] lg:-bottom-[60%] right-0 max-w-[260px]  h-[250px] lg:h-[310px]">
              <Image
               ref={shortImageRef}
                width={600}
                height={900}
                className="w-full h-full max-w-[230px]"
                src="https://liko.foxthemes.me/wp-content/uploads/2024/06/about-3.jpg"
                alt="Gallery Image 1"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
