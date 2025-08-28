"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import HoverEffectMoveable from "@/sharedComponets/ui/effects/HoverEffectMoveable";
import galleryModern from "@/app/fonts/gallery";
import { TTeamData } from "@/types/data";

export default function OurTeam({ teamData }: { teamData: TTeamData[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current, {
      x: "-100%",
      duration: 1.5,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        // markers:true,
      },
    });
  }, [containerRef]);

  if (!teamData.length)
    return (
      <div className="flex items-center justify-center w-full py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <h5>Please add team information from dashboard</h5>
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-nowrap cursor-hide gap-10 mx-auto max-w-[80vw] overflow-x-auto"
    >
      {teamData.map((item) => (
        <div
          key={item.name}
          className="group min-w-[400px] overflow-hidden rounded-[8px] shadow-md"
        >
          <HoverEffectMoveable
            moveAmount={20}
            className="w-full h-full min-h-full !p-0"
          >
            <Image
              className="w-full h-[350px] 2xl:h-[400px] scale-110 group-hover:scale-125 duration-1000"
              src={item.profile}
              width={200}
              height={400}
              alt="Team Profile"
            />
          </HoverEffectMoveable>
          <div className="w-full duration-500 opacity-0 group-hover:opacity-100 h-full absolute left-0 pb-10 bottom-0 bg-gradient-to-t text-white from-black to-transparent pointer-events-none flex flex-col justify-end items-center">
            <p className="uppercase">{item.role}</p>
            <h4 className={`uppercase ${galleryModern.className}`}>
              {item.name}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
}
