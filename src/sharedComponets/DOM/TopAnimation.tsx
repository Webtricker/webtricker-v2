"use client";

import { useEffect, useState } from "react";
import galleryModern from "@/app/fonts/gallery";

export default function TopAnimation({ word }: { word?: string }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <h1
      className={`text-center w-full sm:w-auto sm:text-left xl:text-[180px] text-7xl !leading-[70%] heading ${galleryModern.className}`}
    >
      {isMobile ? (
        <span>{word}</span>
      ) : (
        word?.split("").map((letter, index) => (
          <span
            key={index}
            className="inline-block mx-1 drop-shadow-2xl animate-top-word will-change-transform"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))
      )}
    </h1>
  );
}
