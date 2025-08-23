"use client";
import React, { useEffect, useState } from "react";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IAboutPage } from "@/types/pageTypes";
import {
  useGetAboutPageDataQuery,
  useUpdateAboutPageDataMutation,
} from "@/redux/features/pageData/pageData";
import { ArrowDownIcon } from "@/app/(public pages)/about/components/Icons";
import { useForm } from "react-hook-form";
import BannerBG from "./BannerBG";
import AboutGallery from "./AboutGallery";
import AboutUsThumnail from "./AboutUsThumnail";
import WhatWeDoImg from "./WhatWeDoImg";
import OurServices from "./OurServices";
import { ITeamInfo, ITestimonialsInfo } from "@/types/data";
import OurTeam from "./OurTeam";
import TestimonialsContainer from "./TestimonialsContainer";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { toast } from "react-toastify";
import Button from "@/sharedComponets/ui/buttons/Button";

// ================== default variables
// TODO: have to change this url with
const defaultBannerBG =
  "https://liko.foxthemes.me/wp-content/uploads/2024/06/hero-1.jpg)]";

const defaultIntroText =
  "We are a creative studio that specializes in providing high-quality design and branding solutions to businesses and individuals. Our team is composed of talented designers, developers, and marketers.!";
const aboutUsDefaultDescription =
  "Webtricker Web Design & Development Agency is a total solution of your website related requirements. From branding to web design and then web design to web development. And finally deploy to the hosting. We do everything as one stop service center.";

const ourMissionDescription =
  "Being professional in web development, mobile application, and digital marketing companies. Our mission is to provide customer-centric, result-oriented, cost-competitive innovative & functional IT Solutions to our valuable global clients";

const ourGoalsDescription =
  "We are focused on providing your users the BEST experience they can have on your website. We love creating UNIQUE, ELEGANT and USABLE websites built on solid web standards.";

const whyUsDescription =
  "One of the first things you should know about us is that we don’t do everything. But what we do, we do well. We always try to value our clients time and money. Let us prove it by involving us with you with any of the following services. We&apos;d be happy to serve you with our maximum effort.";

//   ===========
// type Props = {
//   aboutPageData: IAboutPage;
//   testimonials: ITestimonialsInfo[];
//   serviceData: TService[];
//   posts: IBlog[] | null;
// };

// TODO: have to remove the default demoJson;
type Props = {
  teamData: ITeamInfo[];
  testimonialsData: ITestimonialsInfo[];
};
export default function AboutPageForm({ teamData, testimonialsData }: Props) {
  const {
    register,
    setValue,
    handleSubmit,
  } = useForm<IAboutPage>();
  const { data, isLoading } = useGetAboutPageDataQuery({});
  const aboutPageData = data?.data || ({} as IAboutPage);
  const [bannerBG, setBannerBG] = useState(""); // TODO: have to change it later.

  useEffect(() => {
    setValue(
      "bannerBackgroundImage",
      aboutPageData?.bannerBackgroundImage || defaultBannerBG
    );
  }, [aboutPageData?.bannerBackgroundImage, setValue]);

  //  background image change key

  const [updateAboutPage, { isLoading: loading }] =
    useUpdateAboutPageDataMutation();

  // handlers
  const onSubmit = async (updateData: IAboutPage) => {
    console.log(updateData, " update data ");
    try {
      const res = await updateAboutPage({
        id: data?.data?._id,
        data: updateData,
      }).unwrap();
      if (res?.success) {
        toast.success("About page data updated");
      } else {
        toast.error("Failed to update about page data");
      }
    } catch (error: any) {
      console.log(error, " error updating home page data");
      toast.error("Failed to update home page data");
    }
  };

  if (isLoading)
    return (
      <ConditionalReturnContainer>
        <LoadingSpinner />
      </ConditionalReturnContainer>
    );

  if (!data)
    return (
      <ConditionalReturnContainer>
        <p>Add about page data</p>
      </ConditionalReturnContainer>
    );

  return (
    <div className="w-full overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className={`w-full`}>
        <section
          style={{
            backgroundImage: `url(${
              bannerBG ||
              aboutPageData?.bannerBackgroundImage ||
              defaultBannerBG
            })`,
          }}
          className={`flex w-full  h-[140vh]  max-h-[1500px] min-h-[1100px] bg-cover bg-center bg-no-repeat z-0 relative`}
        >
          <div className="w-full h-full flex-col flex grow bg-black/40">
            <Container className="flex max-w-[1000px] pb-1 flex-col justify-center md:justify-end min-h-[700px]  max-h-[900px] h-[93vh] pt-[100px]">
              <div className="w-full text-white pl-3 lg:pl-4 border-l-2 border-white">
                <div className="w-full flex items-center justify-between">
                  <h6>
                    <input
                      id="bannerIntroText.top"
                      className="page-input pl-1"
                      {...register("bannerIntroText.top", { required: true })}
                      placeholder="DIGITAL"
                      defaultValue={aboutPageData?.bannerIntroText?.top || ""}
                    />
                  </h6>
                  <BannerBG setBannerBG={setBannerBG} setValue={setValue} />
                </div>
                <h6>
                  <input
                    id="bannerIntroText.bottom"
                    className="page-input pl-1"
                    {...register("bannerIntroText.bottom", { required: true })}
                    placeholder="CREATIVE AGENCY"
                    defaultValue={aboutPageData?.bannerIntroText?.bottom || ""}
                  />
                </h6>
              </div>
              <h1 className="!text-white mt-4 !leading-[90%] max-w-[900px] -ml-1 md:-ml-1.5 lg:-ml-2 xl:-ml-2.5 font-semibold tracking-tight">
                <textarea
                  id="bannerLargeText"
                  className="page-input pl-1 min-h-[430px] max-w-[900px]"
                  {...register("bannerLargeText", { required: true })}
                  placeholder="Building Digital Presence"
                  defaultValue={aboutPageData?.bannerLargeText || ""}
                ></textarea>
              </h1>
              <p className="!text-white wt_text-shadow max-w-[530px] wt_fs-xl bold mt-5">
                <textarea
                  id="bannerDescription"
                  className="page-input pl-1 min-h-[90px] max-w-[530px] w-full"
                  {...register("bannerDescription", { required: true })}
                  placeholder="A leading responsive web design agency creating stunning, user-friendly websites."
                  defaultValue={aboutPageData?.bannerDescription || ""}
                ></textarea>
              </p>
            </Container>
            <div className="w-full">
              <div className="w-full flex justify-end px-5">
                <button
                  type="button"
                  className="flex items-start gap-5 text-white"
                >
                  <span className="">
                    <input
                      id="scrollDownText"
                      className="page-input pl-1 py-1"
                      {...register("scrollDwonText", { required: true })}
                      placeholder="Scroll To Explore"
                      defaultValue={aboutPageData?.scrollDwonText || ""}
                    />
                  </span>{" "}
                  <ArrowDownIcon className="animate-bounce duration-1000" />
                </button>
              </div>
            </div>
            <Container className="flex justify-end grow items-center">
              <div className="w-full text-white max-w-[600px]">
                <h4>
                  <textarea
                    id="bannerBottomText"
                    className="page-input pl-1 max-w-[600px] w-full min-h-[155px]"
                    {...register("bannerBottomText", { required: true })}
                    placeholder="Liko develops, designs & delivers websites & creative campaigns that drive results,"
                    defaultValue={aboutPageData?.bannerBottomText || ""}
                  />
                </h4>
                <div className="w-full relative mt-5 ">
                  <input
                    id="bannerBottomBtnText"
                    className="page-input max-w-[150px] py-3 pl-1 text-center !rounded-full"
                    {...register("bannerBottomBtnText", { required: true })}
                    placeholder="Our Story"
                    defaultValue={aboutPageData?.bannerBottomBtnText || ""}
                  />
                  <span className="ml-5">href:</span>
                  <input
                    id="bannerBottomBtnLink"
                    className="page-input w-full max-w-[350px] ml-1 py-1 pl-1"
                    {...register("bannerBottomBtnLink", { required: true })}
                    placeholder=""
                    defaultValue={aboutPageData?.bannerBottomBtnLink || ""}
                  />
                </div>
              </div>
            </Container>
          </div>
        </section>

        {/* ======= about page gallery ===== */}
        <section className="section-speacing">
          <div className="w-full section-inner-speacing"></div>
          <Container className="flex">
            <AboutGallery data={aboutPageData} setValue={setValue} />
          </Container>
        </section>

        <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
          <Container>
            <div className="w-full max-w-[1100px]">
              <h3 className="w-full">
                <textarea
                  id="introText"
                  className="page-input w-full  min-h-[450px] pl-1"
                  {...register("introText", { required: true })}
                  placeholder={defaultIntroText}
                  defaultValue={aboutPageData?.introText || ""}
                ></textarea>
              </h3>
            </div>
          </Container>
        </section>

        {/* ======== about our mission, vission and goals ========= */}
        <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
          <Container className="flex lg:items-center gap-12 md:gap-18 xl:gap-20 2xl:gap-28 flex-col lg:flex-row">
            <div className="w-full flex flex-col gap-5 ">
              <div className="w-full">
                <h3 className="heading max-w-[600px] mb-4 !leading-[100%]">
                  <textarea
                    id="aboutUsText"
                    className="page-input max-w-[610px] py-3 pl-1"
                    {...register("aboutUsText", { required: true })}
                    placeholder="We help to make your website creative"
                    defaultValue={aboutPageData?.aboutUsText || ""}
                  ></textarea>
                </h3>
                <p className="w-full">
                  <textarea
                    id="aboutUsDescription"
                    className="page-input w-full pl-1 min-h-[110px] leading_normal"
                    {...register("aboutUsDescription", { required: true })}
                    placeholder={aboutUsDefaultDescription}
                    defaultValue={aboutPageData?.aboutUsDescription || ""}
                  ></textarea>
                </p>
              </div>
              <div className="w-full">
                <h4 className="heading md:mb-1">
                  <input
                    id="ourMissionText"
                    className="page-input w-full pl-1 leading_normal"
                    {...register("ourMissionText", { required: true })}
                    placeholder="Our mission"
                    defaultValue={aboutPageData?.ourMissionText || ""}
                  />
                </h4>
                <p>
                  <textarea
                    id="ourMissionDescription"
                    className="page-input w-full pl-1 min-h-[90px] leading_normal"
                    {...register("ourMissionDescription", { required: true })}
                    placeholder={ourMissionDescription}
                    defaultValue={aboutPageData?.ourMissionDescription || ""}
                  ></textarea>
                </p>
              </div>
              <div className="w-full">
                <h4 className="heading md:mb-1">
                  <input
                    id="ourGoalsText"
                    className="page-input w-full pl-1 leading_normal"
                    {...register("ourGoalsText", { required: true })}
                    placeholder="Our goals"
                    defaultValue={aboutPageData?.ourGoalsText || ""}
                  />
                </h4>
                <p>
                  <textarea
                    id="ourGoalsDescription"
                    className="page-input w-full pl-1 min-h-[90px] leading_normal"
                    {...register("ourGoalsDescription", { required: true })}
                    placeholder={ourGoalsDescription}
                    defaultValue={aboutPageData?.ourGoalsDescription || ""}
                  ></textarea>
                </p>
              </div>
              <div className="w-full">
                <h4 className="heading md:mb-1">
                  <input
                    id="whyUsText"
                    className="page-input w-full pl-1 leading_normal"
                    {...register("whyUsText", { required: true })}
                    placeholder="Why us?"
                    defaultValue={aboutPageData?.whyUsText || ""}
                  />
                </h4>
                <p>
                  <textarea
                    id="whyUsDescription"
                    className="page-input w-full pl-1 min-h-[110px] leading_normal"
                    {...register("whyUsDescription", { required: true })}
                    placeholder={whyUsDescription}
                    defaultValue={aboutPageData?.whyUsDescription || ""}
                  ></textarea>
                </p>
              </div>
            </div>
            <AboutUsThumnail setValue={setValue} data={aboutPageData} />
          </Container>
        </section>

        {/* ========== what we do ========== */}
        <section className="pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18">
          <Container className="flex flex-col sm:flex-row items-start justify-between gap-5 !max-w-[1050px] xl:gap-6 2xl:gap-10 mx-auto">
            <div className="w-full max-w-[280px]">
              <h5 className="heading">
                <input
                  id="whatWeOfferTitle"
                  className="page-input pl-1 max-w-[280px] py-1"
                  {...register("whatWeOfferTitle", { required: true })}
                  placeholder="Something"
                  defaultValue={aboutPageData?.whatWeOfferTitle || ""}
                />
              </h5>
              <div className="w-full flex items-start mt-2">
                <p className="bold whitespace-nowrap">
                  <input
                    id="whatWeOfferSubtitle"
                    className="page-input pl-1 max-w-[280px] py-1"
                    {...register("whatWeOfferSubtitle", { required: true })}
                    placeholder="WHAT WE DO"
                    defaultValue={aboutPageData?.whatWeOfferSubtitle || ""}
                  />
                </p>
                <WhatWeDoImg data={aboutPageData} setValue={setValue} />
              </div>
            </div>
            <OurServices data={aboutPageData} setValue={setValue} />
          </Container>
        </section>

        {/* ======== our team ======= */}
        <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 relative">
          <div className="w-full text-center mb-14 md:mb-16 lg:mb-20">
            <h3 className="text-center middle-border">
              <input
                id="teamInfoTitle"
                className="page-input text-center max-w-[350px] pl-1"
                {...register("teamInfoTitle", { required: true })}
                placeholder="Our Team"
                defaultValue={aboutPageData?.teamInfoTitle || ""}
              />
            </h3>
          </div>
          <OurTeam teamData={teamData} />
        </section>

        {/* ===== fun facts ======== */}
        <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
          <Container className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-y-2">
            <div className="w-full col-span-2 lg:col-span-1 text-center md:text-left mb-3 md:mb-0">
              <p className="bold">
                <input
                  id="aboutUsAnalytics.subTitle"
                  className="page-input max-w-[350px] pl-1"
                  {...register("aboutUsAnalytics.subTitle", { required: true })}
                  placeholder="Fun Facts"
                  defaultValue={aboutPageData?.aboutUsAnalytics?.subTitle || ""}
                />
              </p>
              <h4 className="heading md:max-w-[350px] mt-1">
                <textarea
                  id="aboutUsAnalytics.title"
                  className="page-input max-w-[300px] pl-1"
                  {...register("aboutUsAnalytics.title", { required: true })}
                  placeholder="Agency Snapshots"
                  defaultValue={aboutPageData?.aboutUsAnalytics?.title || ""}
                ></textarea>
              </h4>
            </div>
            <div className="w-full flex flex-col gap-10 text-center md:text-left">
              <div className="w-full ">
                <span className="wt_fs-7xl bold">
                  <input
                    id="aboutUsAnalytics.projectsCompleted"
                    className="page-input max-w-[200px] text-right pl-1"
                    {...register("aboutUsAnalytics.projectsCompleted", {
                      required: true,
                    })}
                    placeholder="200"
                    defaultValue={
                      aboutPageData?.aboutUsAnalytics?.projectsCompleted || ""
                    }
                  />
                  +
                </span>
                <p className="bold uppercase wt_fs-md">
                  <input
                    id="aboutUsAnalytics.projectsCompletedText"
                    className="page-input max-w-[400px] px-2"
                    {...register("aboutUsAnalytics.projectsCompletedText", {
                      required: true,
                    })}
                    placeholder="PROJECTS COMPLETED"
                    defaultValue={
                      aboutPageData?.aboutUsAnalytics?.projectsCompletedText ||
                      ""
                    }
                  />
                </p>
              </div>
              <div className="w-full">
                <span className="wt_fs-7xl bold">
                  <input
                    id="aboutUsAnalytics.teamMembers"
                    className="page-input max-w-[200px] text-right pl-1"
                    {...register("aboutUsAnalytics.teamMembers", {
                      required: true,
                    })}
                    placeholder="21"
                    defaultValue={
                      aboutPageData?.aboutUsAnalytics?.teamMembers || ""
                    }
                  />
                  %
                </span>
                <p className="bold uppercase wt_fs-md">
                  <input
                    id="aboutUsAnalytics.teamMembersText"
                    className="page-input max-w-[200px] pl-1"
                    {...register("aboutUsAnalytics.teamMembersText", {
                      required: true,
                    })}
                    placeholder="Team Members"
                    defaultValue={
                      aboutPageData?.aboutUsAnalytics?.teamMembersText || ""
                    }
                  />
                </p>
              </div>
              <div className="w-full"></div>
            </div>
            <div className="w-full flex flex-col gap-10 text-center md:text-left">
              <div className="w-full">
                <span className="wt_fs-7xl bold">
                  <input
                    id="aboutUsAnalytics.yearsOfExperience"
                    className="page-input max-w-[200px] text-right pl-1"
                    {...register("aboutUsAnalytics.yearsOfExperience", {
                      required: true,
                    })}
                    placeholder="17"
                    defaultValue={
                      aboutPageData?.aboutUsAnalytics?.yearsOfExperience || ""
                    }
                  />
                  +
                </span>
                <p className="bold uppercase wt_fs-md">
                  <input
                    id="aboutUsAnalytics.yearsOfExperienceText"
                    className="page-input max-w-[400px] px-2"
                    {...register("aboutUsAnalytics.yearsOfExperienceText", {
                      required: true,
                    })}
                    placeholder="YEARS OF EXPERIENCE"
                    defaultValue={
                      aboutPageData?.aboutUsAnalytics?.yearsOfExperienceText ||
                      ""
                    }
                  />
                </p>
              </div>
              <div className="w-full">
                <span className="wt_fs-7xl bold">
                  <input
                    id="aboutUsAnalytics.growingRate"
                    className="page-input max-w-[200px] text-right pl-1"
                    {...register("aboutUsAnalytics.growingRate", {
                      required: true,
                    })}
                    placeholder="391"
                    defaultValue={
                      aboutPageData?.aboutUsAnalytics?.growingRate || ""
                    }
                  />
                  %
                </span>
                <p className="bold uppercase wt_fs-md">
                  <input
                    id="aboutUsAnalytics.growingRateText"
                    className="page-input max-w-[200px] pl-1"
                    {...register("aboutUsAnalytics.growingRateText", {
                      required: true,
                    })}
                    placeholder="GROWING AGENCY"
                    defaultValue={
                      aboutPageData?.aboutUsAnalytics?.growingRateText || ""
                    }
                  />
                </p>
              </div>
              <div className="w-full"></div>
            </div>
          </Container>
        </section>

        {/* ========== Testimonials ======  */}
        <TestimonialsContainer
          data={aboutPageData}
          setValue={setValue}
          testimonials={testimonialsData}
        />

        {/* ====== invitatiion section ========= */}
        <section className="pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18 pb-20">
          <Container className="w-full flex flex-col">
            <p className="bold text-center mb-2">
              <input
                id="resumeeSendingText"
                className="page-input text-center max-w-[550px] w-full pl-1"
                {...register("resumeeSendingText", {
                  required: true,
                })}
                placeholder="SEND YOUR RESUME TO career@webtricker.com"
                defaultValue={aboutPageData?.resumeeSendingText || ""}
              />
            </p>
            <p className="bold text-center mb-2">
              <span>mailto: </span>
              <input
                id="resumeeSendingEmail"
                className="page-input max-w-[300px] w-full pl-1"
                {...register("resumeeSendingEmail", {
                  required: true,
                })}
                placeholder="career@webtricker.com"
                defaultValue={aboutPageData?.resumeeSendingEmail || ""}
              />
            </p>
            <h2 className="wt_fs-big text-center heading">
              <input
                id="bottomTextLarge"
                className="page-input max-w-[950px] text-center w-full pl-1"
                {...register("bottomTextLarge", {
                  required: true,
                })}
                placeholder="JOIN US"
                defaultValue={aboutPageData?.bottomTextLarge || ""}
              />
            </h2>
          </Container>
        </section>
        <section className="section ">
          {loading ? <LoadingSpinner /> : <Button label="Save" />}
        </section>
      </form>
    </div>
  );
}
