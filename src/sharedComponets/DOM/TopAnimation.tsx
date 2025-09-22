"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import galleryModern from "@/app/fonts/gallery";

export default function TopAnimation({ word }: { word?: string }) {
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const letters = lettersRef.current;
    if (!letters.length) return;

    // gsap.set(letters, {
    //   opacity: 0,
    //   y: -300,
    //   rotation: -15,
    //   scale: 0.3,
    // });

    // const tl = gsap.timeline({ delay: 1.8 });
    const tl = gsap.timeline();

    letters.forEach((letter, index) => {
      tl.to(
        letter,
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 1.2,
          ease: "bounce.out",
        },
        index * 0.1
      );
    });

    tl.to(
      letters,
      {
        y: -8,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.05,
      },
      "+=0.5"
    );
  }, []);

  return (
    <h1
      className={`text-center w-full sm:w-auto sm:text-left xl:text-[180px] text-7xl !leading-[70%] heading ${galleryModern.className}`}
    >
      {word?.split("").map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className="inline-block mx-1 drop-shadow-2xl opacity-0 -translate-y-[300px] -rotate-[15deg] scale-[0.3] will-change-transform"
        >
          {letter}
        </span>
      ))}
    </h1>
  );
}
