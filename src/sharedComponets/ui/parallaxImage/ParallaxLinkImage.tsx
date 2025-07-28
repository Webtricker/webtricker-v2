"use client";

import { setFloatingText } from "@/redux/features/dom/floatingDotSlice";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import gsap from "gsap";

type Props = {
  href: string;
  containerStyle: string;
  imgStyle?: string;
  src: string;
};

export default function ParallaxLinkImage({
  href,
  src,
  containerStyle,
  imgStyle = "",
}: Props) {
  const dispatch = useDispatch();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const parentContainerRef = useRef<HTMLImageElement | null>(null);

  const toggleShowText = (text: string | null) => {
    dispatch(setFloatingText(text));
  };

  useEffect(() => {
    if (!imageRef.current || !parentContainerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { y: "-40%" }, // initial position
        {
          y: "0%", // final position
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 95%",
            end: "bottom 60",
            scrub: true,
          },
        }
      );

       gsap.fromTo(parentContainerRef.current, 
        {  y: '0',},
        {
        y: '40%',
        ease: 'none',
        scrollTrigger: {
          trigger: parentContainerRef.current,
          start: 'bottom 60%',
          end: 'bottom 25',
          scrub: true,  
        },
      });
    });

    return () => ctx.revert(); // clean up on unmount
  }, []);

  return (
    <Link
      onMouseOverCapture={() => toggleShowText("View Demo")}
      onMouseLeave={() => toggleShowText(null)}
      href={href}
      className="relative cursor-hide inline w-full sm:w-auto"
    >
      <div className={`border border-slate-300 dark:border-slate-600 relative w-full rounded-[10px] overflow-hidden ${containerStyle}`}>
        <div
        ref={parentContainerRef}
          className={` w-full h-full`}
        >
          <Image
            ref={imageRef}
            className={`w-full h-[130%] object-cover ${imgStyle}`}
            src={src}
            width={400}
            height={600}
            alt="Parallax effect image"
          />
        </div>
      </div>
    </Link>
  );
}
