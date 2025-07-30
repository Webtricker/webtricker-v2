"use client";
import React from "react";
import Marquee from "react-fast-marquee";
import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import { ITestimonialsInfo } from "@/types/data";


export default function Clients({testimonials=[]}:{testimonials:ITestimonialsInfo[]}) {
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <Container>
        <div className="w-full flex-col  md:flex-row flex md:items-center gap-5 lg:gap-10 overflow-hidden">
          <p className="uppercase whitespace-nowrap shrink-0">
            clients we&apos;ve worked with
          </p>
          <Marquee
            speed={80}          
            gradient={false}    
            pauseOnHover={false}
            className="flex items-center"
          >
            {testimonials.map((item) => <Image className="block border border-slate-300 dark:border-slate-700 mx-12 w-20 h-20 rounded-full" key={item._id} src={item.profile} width={100} height={100} alt={item.name} />)}
          </Marquee>
        </div>
      </Container>
    </section>
  );
}
