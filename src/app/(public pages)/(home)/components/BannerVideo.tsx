"use client";

import React, { useEffect, useState } from "react";

export default function BannerVideo({ src, type }: { src: string, type: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  if (type !== "video") return null;

  if (!mounted || !isDesktop) {
    return <video preload="none" className="hidden md:block sm:w-[120px] rounded-full sm:h-[80px] md:w-[160px] md:h-[100px] lg:w-[220px] lg:h-[120px] 2xl:w-[270px] 2xl:h-[160px]"></video>;
  }

  return (
    <video
      muted
      autoPlay
      loop
      playsInline
      className="hidden md:block sm:w-[120px] rounded-full sm:h-[80px] md:w-[160px] md:h-[100px] lg:w-[220px] lg:h-[120px] 2xl:w-[270px] 2xl:h-[160px]"
      src={src}
    ></video>
  );
}
