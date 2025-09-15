"use client";
import { setFloatingText } from "@/redux/features/dom/floatingDotSlice";
import LinkButton from "@/sharedComponets/ui/buttons/LinkButton";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TPortfolio } from "@/types/portfolio";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

type Props = {
  src: string;
  title: string;
};

const ParallaxImage = ({ src, title }: Props) => {
  // hooks
  const dispatch = useDispatch();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const parentContainerRef = useRef<HTMLDivElement | null>(null);

  // handlers
  const toggleShowText = (text: string | null) => {
    dispatch(setFloatingText(text));
  };

  useEffect(() => {
    if (!imageRef.current || !parentContainerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        x: 0,
        ease: "none",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 79",
          end: "bottom 10%",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      onMouseOverCapture={() => toggleShowText("View Details")}
      onMouseLeave={() => toggleShowText(null)}
      ref={parentContainerRef}
      className="w-full z-0 group overflow-hidden h-full relative p-2"
    >
      <Image
        ref={imageRef}
        className="pointer-events-none min-w-[200%] z-10 absolute top-0 left-0 -translate-x-[40%] h-full"
        src={src}
        width={400}
        height={600}
        alt="Parallax effect image"
      />
      <div className="w-full pointer-events-none group-hover:opacity-100 group-hover:blur-md duration-300 absolute top-0 left-0 opacity-0 z-20 bg-slate-900/40 h-full"></div>
      <div className="w-full flex pointer-events-none justify-end p-5 md:p-6 lg:p-7 flex-col group-hover:translate-y-0 duration-300 absolute bottom-0 left-0 translate-y-full z-30">
        <h3 className="text-white">{title}</h3>
      </div>
    </div>
  );
};

export default function PortfolioSlider({
  portfolios = [],
  linkText,
}: {
  portfolios?: TPortfolio[];
  linkText: string;
}) {
  const pinContainer = useRef<HTMLDivElement | null>(null);
  const targetEl = useRef<HTMLDivElement | null>(null);
  const triggerEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetEl?.current || !triggerEl?.current || !pinContainer?.current)
      return;

    const getExtraSpace = () => {
      if (typeof window == "undefined") return 20;
      if (window.innerWidth >= 1280) return 30;
      if (window.innerWidth >= 1024) return 20;
      if (window.innerWidth >= 768) return 15;
      return 10;
    };

    const totalWidth =
      targetEl.current!.scrollWidth - window.innerWidth + getExtraSpace();
    const ctx = gsap.context(() => {
      gsap.to(targetEl.current, {
        x: -totalWidth,
        scrollTrigger: {
          trigger: triggerEl.current,
          start: "top 79",
          end: "+=100%",
          scrub: true,
          pinSpacing: false,
          pin: pinContainer.current,
        },
      });
    }, targetEl);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full">
      <div ref={triggerEl} className="w-full h-[0.1px]"></div>
      <div
        ref={pinContainer}
        className="w-full flex flex-col min-h-[700px] h-[calc(100vh-79px)] justify-center grow overflow-hidden"
      >
        <div
          ref={targetEl}
          className="w-full flex items-center grow flex-nowrap px-4 md:px-5 gap-8 lg:gap-10"
        >
          {portfolios.map((portfolio) => (
            <Link
              href={`/portfolio/${portfolio.slug}`}
              className="cursor-hide inline-block min-w-[300px] rounded-[6px] overflow-hidden w-[300px]  h-[90%]  md:w-[400px] md:min-w-[400px] lg:w-[450px] lg:min-w-[450px] xl:w-[500px] xl:min-w-[500px]"
              key={portfolio._id}
            >
              <ParallaxImage
                title={portfolio.title}
                src={portfolio.thumnail.url || ""}
                key={portfolios[0]._id}
              />
            </Link>
          ))}
        </div>

        <Container>
          <div className="w-full flex items-center justify-center pt-5 pb-8 md:pb-10">
            <LinkButton
              className="lg:min-w-[484px] text-center"
              label={linkText || "View All Projects"}
              href="/portfolio"
            />
          </div>
        </Container>
      </div>
      <div className="w-full h-screen"></div>
    </div>
  );
}
