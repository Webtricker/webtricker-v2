"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const IntroVideoSkeleton = () => (
  <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18 relative hidden md:block">
    <div className="w-full h-[0.1px]"></div>
    <div className="w-full ">
      <div className="w-full rounded-t-[16px] z-0 max-w-[35vw] overflow-hidden mx-auto">
        <video preload="none" className="hidden md:block h-screen max-h-screen w-full"></video>
      </div>
    </div>
    <div className="w-full h-screen"></div>
  </section>
);

const IntroVideo = dynamic(() => import("./IntroVideo"), {
  ssr: false,
  loading: () => <IntroVideoSkeleton />,
});

export default function DesktopIntroVideo({ homeData }: { homeData: any }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  if (!isDesktop) return <IntroVideoSkeleton />;

  return <IntroVideo homeData={homeData} />;
}
