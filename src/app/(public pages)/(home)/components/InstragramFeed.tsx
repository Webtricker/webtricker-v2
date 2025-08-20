"use client"
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

export default function InstragramFeed({images}:{images:string[]}) {  
  return (
    <section className="w-full py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <div className="w-full relative">
        <div className="w-full rounded-edge-container absolute rotate-180 -top-1 z-50 pointer-events-none">
          <svg
            id="wave"
            viewBox="0 0 1440 100"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="currentColor" d="M0,100L1440,100Q720,0 0,100Z"></path>
          </svg>
          <div className="w-full h-1"></div>
        </div>
        <Marquee
          speed={80}
          gradient={false}
          pauseOnHover={false}
          className="flex items-center"
        >
          {images?.map((image, index) => (
            <div key={index} className="slide px-2 md:px-2.5 lg:px-5">
              <Image
                src={image}
                alt="Slider image"
                width={323.6}
                height={200}
                className="w-[200px] h-[300px] md:w-[270px] md:h-[420px] lg:w-[323px] lg:h-[570px]"
              />
            </div>
          ))}
        </Marquee>
        <div className=" w-full rounded-edge-container absolute -bottom-1 z-50 pointer-events-none">
          <svg 
            id="wave"
            viewBox="0 0 1440 100"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="currentColor" d="M0,100L1440,100Q720, 0 0,100Z"></path>
          </svg>
          <div className="w-full h-1"></div>
        </div>
      </div>
    </section>
  );
}
