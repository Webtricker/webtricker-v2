"use client";

import { useEffect, useState } from "react";

export default function RightAnimation({ word }: { word?: string }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <span>
      {isMobile ? (
        <span>{word}</span>
      ) : (
        word?.split("").map((letter, index) => (
          <span
            key={index}
            className="inline-block mx-1 drop-shadow-2xl animate-right-word will-change-transform"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {letter}
          </span>
        ))
      )}
    </span>
  );
}
