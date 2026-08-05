"use client";

import React, { useEffect, useState } from "react";

export default function IntroResponsiveVideo({ src, type }: { src: string, type: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  if (type !== "video") return null;

  if (!mounted || !isDesktop) {
    return <video preload="none" className="hidden md:block h-screen max-h-screen w-full"></video>;
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="hidden md:block h-screen max-h-screen w-full object-cover"
      src={src}
    ></video>
  );
}
