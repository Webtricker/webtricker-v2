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
    return <div className="hidden md:block h-screen max-h-screen w-full" />;
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
