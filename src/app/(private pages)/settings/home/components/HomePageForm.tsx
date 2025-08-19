"use client";
import React from "react";
import Container from "@/sharedComponets/ui/wrapper/Container";
import galleryModern from "@/app/fonts/gallery";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import { useForm } from "react-hook-form";
import { IHomePage } from "@/types/pageTypes";
import { useGetHomePageDataQuery } from "@/redux/features/pageData/pageData";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import BannerSpinningIcon from "./BannerSpinningIcon";
import Button from "@/sharedComponets/ui/buttons/Button";
import BannerRoundVideo from "./BannerRoundVideo";
import IntroVideo from "./IntroVideo";
import Marquee from "react-fast-marquee";
import { ITestimonialsInfo } from "@/types/data";
import TestimonialsContainer from "./TestimonialsContainer";
import { demoJson } from "@/data/demoData";

// TODO: Have to remove these default data
const bannerDescription = `Webtricker designs, develops, and delivers high-quality, responsive websites with pixel-perfect precision. We’re passionate, detail-driven, and committed to exceeding expectations. Have a project in mind?`;

type Props = {
  homePageData: IHomePage;
  testimonials: ITestimonialsInfo[];
};


// TODO: have to remove the default demoJson;
export default function HomePageForm({ homePageData=demoJson, testimonials }: Props) {
  const {
    register,
    setValue,
    // formState: { errors },
  } = useForm<IHomePage>();
  const { data, isLoading } = useGetHomePageDataQuery({});

  if (isLoading)
    return (
      <ConditionalReturnContainer>
        <LoadingSpinner />
      </ConditionalReturnContainer>
    );

  if (!data)
    return (
      <ConditionalReturnContainer>
        <p>Add Home page data</p>
      </ConditionalReturnContainer>
    );
  return (
    <div className="w-full overflow-x-hidden">
      <form
        className={`w-full mt-[100px] sm:mt-[130px] md:mt-[150px] lg:mt-[180px] 2xl:mt-[200px]`}
      >
        <Container className="">
          <div className="w-full flex-col sm:flex-row flex items-start sm:gap-5 md:gap-8 lg:gap-14 justify-center">
            <span className="mb-5 sm:mb-0 inline-block heading !text-[18px] lg:!text-[20px] leading-[100%] whitespace-nowrap">
              <input
                id="greeting.top"
                className="page-input pl-1"
                {...(register("greeting.top"), { required: true })}
                placeholder="Hello"
              />
              <br />
              <input
                id="greeting.bottom"
                className="page-input mt-1 pl-1"
                {...(register("greeting.bottom"), { required: true })}
                placeholder="People! We’re"
              />
            </span>
            <input
              id="bannerText.top"
              className={`text-center max-w-[50vw] !rounded-[10px] sm:w-auto sm:text-left wt_fs-giant banner-large-text heading page-input px-4 ${galleryModern.className}`}
              {...(register("bannerText.top"), { required: true })}
              placeholder="Creative"
            />
            <div className="hidden z-0 sm:inline mt-2 md:mt-4 2xl:mt-10">
              <BannerSpinningIcon data={homePageData} setValue={setValue} />
            </div>
          </div>
          <h1
            className={`flex-col sm:flex-row gap-4 ${galleryModern.className} mt-6 md:mt-8 lg:mt-10 2xl:mt-14 wt_fs-giant banner-large-text flex w-full items-center justify-center heading`}
          >
            <input
              id="bannerText.left"
              className={`max-w-[555px] w-full page-input ${galleryModern.className}`}
              {...(register("bannerText.left"), { required: true })}
              placeholder="Digital"
            />
            <span className="tp-hero-title-img">
              <BannerRoundVideo data={homePageData} setValue={setValue} />
            </span>
            <input
              id="bannerText.right"
              className={`max-w-[575px] w-full page-input ${galleryModern.className}`}
              {...(register("bannerText.right"), { required: true })}
              placeholder="Studio"
            />
          </h1>

          <div className="w-full mt-5 sm:mt-10 lg:mt-14 2xl:mt-20 max-w-[600px] mx-auto">
            <span className="hidden lg:inline-block float-left w-[95px] h-0.5 "></span>
            <p className="text-center lg:text-left !leading-[140%]">
              <textarea
                id="bannerDescription"
                className={`min-h-[100px] w-full page-input p-2 ${galleryModern.className}`}
                {...(register("bannerDescription"), { required: true })}
                placeholder={bannerDescription}
              ></textarea>
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

        {/* ======= banner section ends ======== */}

        <IntroVideo data={homePageData} setValue={setValue} />

        {/* ======= clients section starts ======== */}
        <section className="w-full py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
          <Container>
            <div className="w-full max-w-[70vw] flex-col  md:flex-row flex md:items-center gap-5 lg:gap-10 overflow-hidden">
              <p className="uppercase whitespace-nowrap shrink-0">
                <input
                  id="clientSectionSubtitle"
                  className={`w-full min-w-[260px] page-input px-1 py-2 wt_fs-md`}
                  {...(register("clientSectionSubtitle"), { required: true })}
                  placeholder="clients we've worked with"
                />
              </p>
              <Link className="grow block " href="/settings/testimonials">
                <Marquee
                  speed={80}
                  gradient={false}
                  pauseOnHover={false}
                  className="flex items-center"
                >
                  {testimonials.map((item) => (
                    <Image
                      className="block border border-slate-300 dark:border-slate-700 mx-12 w-20 h-20 rounded-full"
                      key={item._id}
                      src={item.profile}
                      width={100}
                      height={100}
                      alt={item.name}
                    />
                  ))}
                </Marquee>
              </Link>
            </div>
          </Container>
        </section>

          {/* ======= services section starts ======== */}
           <TestimonialsContainer setValue={setValue} data={homePageData} testimonials={testimonials} />

        <Container className="min-h-20 mt-20">
          <Button className="!py-3" label="Update home page" />
        </Container>
      </form>
    </div>
  );
}
