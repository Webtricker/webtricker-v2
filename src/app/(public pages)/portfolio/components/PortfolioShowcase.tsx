"use client";
import Button from "@/sharedComponets/ui/buttons/Button";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import { TPortfolio } from "@/types/portfolio";
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
            <p className="text-center font-medium flex items-center justify-center gap-1">
              Checkout:
              <a
                href={portfolio?.liveLink}
                target="_blank"
                className="text-[#aa013f] font-normal flex items-center gap-1 animate-underline"
              >
                {portfolio?.liveLink} <ArrowUpRightIcon />
              </a>
            </p>
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
