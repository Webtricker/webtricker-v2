"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  src: string;
};

export default function ParallaxBanner({ src }: Props) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const parentContainerRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageRef.current || !parentContainerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: parentContainerRef.current,
          start: "top 70%%",
          end: "bottom 70",
          scrub: true,
        },
      });
    });

    return () => ctx.revert(); // clean up on unmount
  }, []);

  return (
    <div
      ref={parentContainerRef}
      className={`overflow-hidden w-full h-[70vh] min-h-[500px] md:min-h-[600px] lg:min-h-[700px] relative max-h-[900px] rounded-[8px] my-10 md:my-14 lg:my-16 xl:my-20`}
    >
      <Image
        ref={imageRef}
        className={`w-full absolute top-0 left-0 -translate-y-[30%]  h-[130%] object-cover`}
        src={src}
        width={400}
        height={600}
        alt="Parallax effect image"
      />
    </div>
  );
}
