"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LeftAnimation({ word }: { word?: string }) {
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const letters = lettersRef.current;
    if (!letters.length) return;

    // gsap.set(letters, {
    //   opacity: 0,
    //   x: -400,
    //   rotation: 25,
    //   scale: 0.4,
    // });

    // const tl = gsap.timeline({ delay: 1.5 });
    const tl = gsap.timeline();

    letters.forEach((letter, index) => {
      tl.to(
        letter,
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.4)",
        },
        index * 0.08
      );
    });

    tl.to(
      letters,
      {
        x: 5,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.03,
      },
      "+=0.3"
    );
  }, []);

  return (
    <span>
      {word?.split("").map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className="inline-block mx-1 drop-shadow-2xl opacity-0 -translate-x-[400px] rotate-[25deg] scale-[0.4] will-change-transform"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
