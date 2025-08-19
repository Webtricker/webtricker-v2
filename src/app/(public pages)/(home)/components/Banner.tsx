import galleryModern from "@/app/fonts/gallery";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Banner() {
  return (
    <div
      className={`w-full mt-[100px] sm:mt-[130px] md:mt-[150px] lg:mt-[180px] 2xl:mt-[200px]`}
    >
      <Container className="">
        <div className="w-full flex-col sm:flex-row flex items-start sm:gap-5 md:gap-8 lg:gap-14 justify-center">
          <span className="mb-5 sm:mb-0 inline-block heading !text-[18px] lg:!text-[20px] leading-[100%] whitespace-nowrap">
            Hello <br /> People! We’re
          </span>
          <span
            className={`text-center w-full sm:w-auto sm:text-left wt_fs-giant banner-large-text heading  ${galleryModern.className}`}
          >
            Creative
          </span>
          <div className="hidden z-0 sm:inline mt-2 md:mt-4 2xl:mt-10">
            <Image
              className="inline dark:hidden banner-spinning-star w-5 md:w-6 lg:w-8 2xl:!w-10"
              width={40}
              height={40}
              src="/images/home/hero-shape-1-1-black.webp"
              alt="Star"
            />
            <Image
              className="hidden dark:inline banner-spinning-star w-5 md:w-6 lg:w-8 2xl:!w-10"
              width={40}
              height={40}
              src="/images/home/hero-shape-star-white.png"
              alt="Star"
            />
          </div>
        </div>
        <h1
          className={`flex-col sm:flex-row gap-4 ${galleryModern.className} mt-6 md:mt-8 lg:mt-10 2xl:mt-14 wt_fs-giant banner-large-text flex w-full items-center justify-center heading`}
        >
          Digital
          <span className="tp-hero-title-img">
            <Image
              width={270}
              height={160}
              decoding="async"
              className="hidden md:block sm:w-[120px] sm:h-[80px] md:w-[160px] md:h-[100px] lg:w-[220px] lg:h-[120px] 2xl:w-[270px] 2xl:h-[160px]"
              src="http://liko.foxthemes.me/wp-content/uploads/2024/06/hero-1-1.png"
              alt=""
            />
          </span>
          Agency
        </h1>

        <div className="w-full mt-5 sm:mt-10 lg:mt-14 2xl:mt-20 max-w-[600px] mx-auto">
          <span className="hidden lg:inline-block float-left w-[95px] h-0.5 "></span>
          <p className="text-center lg:text-left !leading-[140%]">
            Webtricker designs, develops, and delivers high-quality, responsive
            websites with pixel-perfect precision. We’re passionate,
            detail-driven, and committed to exceeding expectations. Have a
            project in mind?{" "}
            <Link
              href="/contact"
              className="btn-line-effect !inline-flex gap-1.5 items-center"
            >
              <span>Let’s talk</span>
              <ArrowUpRightIcon />
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
