"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const IntroVideo = dynamic(() => import("./IntroVideo"), { ssr: false });

export default function DesktopIntroVideo({ homeData }: { homeData: any }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  if (!isDesktop) return <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18 relative hidden md:block" />;

  return <IntroVideo homeData={homeData} />;
}
