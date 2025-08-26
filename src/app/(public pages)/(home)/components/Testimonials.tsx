"use client";
import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import React from "react";
import testimonialsBanner from "@/assets/images/home/testimonials-banner.webp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import galleryModern from "@/app/fonts/gallery";
import { ITestimonialsInfo } from "@/types/data";

export default function Testimonials({
  sectionBg,
  testimonials = [],
}: {
  sectionBg: string;
  testimonials: ITestimonialsInfo[];
}) {
  if (!testimonials.length)
    return (
      <div className="flex items-center justify-center w-full py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <h5>Please add testimonial from dashboard</h5>
      </div>
    );
  return (
    <section className="relative py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <div className="w-full min-h-[300px] relative z-0 ">
        <Image
          className="w-full h-[85%] object-cover absolute top-0 left-0 -z-10"
          src={sectionBg || testimonialsBanner}
          width={1000}
          height={400}
          alt="Testimonals Banner"
        />

        <div className="absolute md:flex items-center top-40 hidden -left-10 lg:left-20 2xl:left-40 z-0 uppercase -rotate-90 p-2 bg-green-600/80">
          <div className="md:flex items-center py-2 px-5 bg-[var(--clr-bg-body-dark)]">
            <Image
              className="w-10 h-10 rotate-90"
              src="/icons/home/testimoials-clicking-hand.svg"
              width={50}
              height={50}
              alt="Hand icon"
            />
            <span className={`text-white font-semibold`}>Our Testimonials</span>
          </div>
        </div>

        <Container className="relative z-10">
          <div className="w-full flex items-center justify-end  ">
            <div className="testimonials-container bg-gradient-to-tr from-amber-200/60">
              <h6>Testimonials</h6>
              <h4
                className={`heading font-semibold mb-5 mt-1 ${galleryModern.className}`}
              >
                From Our Cients
              </h4>
              <Swiper
                spaceBetween={30}
                effect={"slide"}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={true}
                modules={[EffectFade, Autoplay]}
                className="mySwiper"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial._id}>
                    <p>{testimonial.review}</p>

                    <div className="w-full gap-5 flex items-center mt-10">
                      <Image
                        className="w-20 min-w-20 lg:min-w-[100px] border object-cover border-slate-300 dark:border-slate-700 rounded-full lg:w-[100px] h-20 lg:h-[100px]"
                        src={testimonial.profile}
                        width={100}
                        height={100}
                        alt="profile image"
                      />
                      <div className="w-full flex flex-col">
                        <h6>{testimonial.name}</h6>
                        <p>{testimonial.role}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
