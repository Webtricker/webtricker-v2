"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import { TTeamData } from "@/types/data";

export default function TeamInfo({
  teamData,
  title,
}: {
  teamData: TTeamData[];
  title: string;
}) {
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
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 relative">
      <div className="w-full text-center mb-14 md:mb-16 lg:mb-20">
        <h3 className="text-center middle-border">{title}</h3>
      </div>
      <div ref={containerRef} className="w-full cursor-hide">
        <Swiper
          //  dir="ltr"
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={20}
          navigation={false}
          centeredSlides={true}
          loop={true}
          //   autoplay={{
          //     delay: 5000,
          //     disableOnInteraction: false,
          //   }}
          breakpoints={{
            0: {
              slidesPerView: 1.5,
            },
            640: {
              slidesPerView: 2.5,
            },
            768: {
              slidesPerView: 3.5,
            },
            1024: {
              slidesPerView: 4.5,
            },
            1280: {
              slidesPerView: 5.5,
            },
          }}
          className="w-full"
        >
          {[...teamData, ...teamData, ...teamData].map((item, index) => (
            <SwiperSlide className="" key={index}>
              <div className="border p-4 flex flex-col gap-2 items-center max-w-[300px] rounded-2xl min-h-[320px] border-green-600">
                <Image
                  className="w-[200px] h-[200px] rounded-full"
                  src={item?.profile}
                  alt={item?.name}
                  width={200}
                  height={200}
                />
                <div className="text-center">
                  <h6 className="font-bold">{item.name}</h6>
                  <p className="italic">{item.role}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
