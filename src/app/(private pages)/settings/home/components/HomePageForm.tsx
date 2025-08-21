"use client";
import React from "react";
import Container from "@/sharedComponets/ui/wrapper/Container";
import galleryModern from "@/app/fonts/gallery";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import { useForm } from "react-hook-form";
import { IHomePage } from "@/types/pageTypes";
import {
  useGetHomePageDataQuery,
  useUpdateHomePageDataMutation,
} from "@/redux/features/pageData/pageData";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import BannerSpinningIcon from "./BannerSpinningIcon";
import Button from "@/sharedComponets/ui/buttons/Button";
import BannerRoundVideo from "./BannerRoundVideo";
import IntroVideo from "./IntroVideo";
import Marquee from "react-fast-marquee";
import { ITestimonialsInfo, TService } from "@/types/data";
import TestimonialsContainer from "./TestimonialsContainer";
import { ServiceCard } from "@/app/(public pages)/(home)/components/Services";
import BlogCardWrapper from "@/sharedComponets/ui/wrapper/BlogCardWrapper";
import { IBlog } from "@/types/post";
import BottomSlider from "./BottomSlider";
import { toast } from "react-toastify";

// TODO: Have to remove these default data
const bannerDescription = `Webtricker designs, develops, and delivers high-quality, responsive websites with pixel-perfect precision. We’re passionate, detail-driven, and committed to exceeding expectations. Have a project in mind?`;

type Props = {
  testimonials: ITestimonialsInfo[];
  serviceData: TService[];
  posts: IBlog[] | null;
};

// TODO: have to remove the default demoJson;
export default function HomePageForm({
  testimonials,
  serviceData,
  posts,
}: Props) {
  const {
    register,
    setValue,
    handleSubmit,
    // formState: { errors },
  } = useForm<IHomePage>();
  const { data, isLoading } = useGetHomePageDataQuery({});
  const [updateHomePage, { isLoading: loading }] =
    useUpdateHomePageDataMutation();

  // handlers
  const onSubmit = async (updateData) => {
    try {
      const res = await updateHomePage({
        id: data?.data?._id,
        data: updateData,
      }).unwrap();
      if (res?.success) {
        toast.success("Home page data updated");
      } else {
        toast.error("Failed to update home page data");
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
        <p>Add Home page data</p>
      </ConditionalReturnContainer>
    );
  const homePageData = data?.data || {};
  console.log(homePageData, "  home page data from private page");
  return (
    <div className="w-full overflow-x-hidden">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full mt-[100px] sm:mt-[130px] md:mt-[150px] lg:mt-[180px] 2xl:mt-[200px]`}
      >
        <Container className="">
          <div className="w-full flex-col sm:flex-row flex items-start sm:gap-5 md:gap-8 lg:gap-14 justify-center">
            <span className="mb-5 sm:mb-0 inline-block heading !text-[18px] lg:!text-[20px] leading-[100%] whitespace-nowrap">
              <input
                id="greeting.top"
                className="page-input pl-1"
                {...register("greeting.top", { required: true })}
                placeholder="Hello"
                defaultValue={homePageData?.greeting?.top || ""}
              />
              <br />
              <input
                id="greeting.bottom"
                className="page-input mt-1 pl-1"
                {...register("greeting.bottom", { required: true })}
                placeholder="People! We’re"
                defaultValue={homePageData?.greeting?.bottom || ""}
              />
            </span>
            <input
              id="bannerText.top"
              className={`text-center max-w-[50vw] !rounded-[10px] sm:w-auto sm:text-left wt_fs-giant banner-large-text heading page-input px-4 ${galleryModern.className}`}
              {...register("bannerText.top", { required: true })}
              placeholder="Creative"
              defaultValue={homePageData?.bannerText?.top || ""}
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
              {...register("bannerText.left", { required: true })}
              placeholder="Digital"
              defaultValue={homePageData?.bannerText?.left || ""}
            />
            <span className="tp-hero-title-img">
              <BannerRoundVideo data={homePageData} setValue={setValue} />
            </span>
            <input
              id="bannerText.right"
              className={`max-w-[575px] w-full page-input ${galleryModern.className}`}
              {...register("bannerText.right", { required: true })}
              placeholder="Studio"
              defaultValue={homePageData?.bannerText?.right || ""}
            />
          </h1>

          <div className="w-full mt-5 sm:mt-10 lg:mt-14 2xl:mt-20 max-w-[600px] mx-auto">
            <span className="hidden lg:inline-block float-left w-[95px] h-0.5 "></span>
            <p className="text-center lg:text-left !leading-[140%]">
              <textarea
                id="bannerDescription"
                className={`min-h-[100px] w-full page-input p-2 ${galleryModern.className}`}
                {...register("bannerDescription", { required: true })}
                placeholder={bannerDescription}
                defaultValue={homePageData?.bannerDescription || ""}
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
                  {...register("clientSectionSubtitle", { required: true })}
                  placeholder="Clients we've worked with"
                  defaultValue={homePageData?.clientSectionSubtitle || ""}
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
        <TestimonialsContainer
          setValue={setValue}
          data={homePageData}
          testimonials={testimonials}
        />

        <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
          <Container>
            <div className="w-full flex-col md:flex-row gap-10 sm:gap-16 md:gap-10 flex justify-between">
              <div className="w-full">
                <h2 className="heading inline !leading-[100%]">
                  <input
                    id="serviceSectionTitle.large"
                    className={`max-w-[575px] w-full page-input`}
                    {...register("serviceSectionTitle.large", {
                      required: true,
                    })}
                    placeholder="Thoughtful"
                    defaultValue={
                      homePageData?.serviceSectionTitle?.large || ""
                    }
                  />
                </h2>
                <div className="w-full flex flex-wrap lg:flex-nowrap items-end gap-2">
                  <h2
                    className={`heading !leading-[100%] ${galleryModern.className}`}
                  >
                    <input
                      id="serviceSectionTitle.medium"
                      className={`max-w-[400px] w-full page-input`}
                      {...register("serviceSectionTitle.medium", {
                        required: true,
                      })}
                      placeholder="Process"
                      defaultValue={
                        homePageData?.serviceSectionTitle?.medium || ""
                      }
                    />
                  </h2>
                  <h6 className="mb-2 md:mb-4 heading">
                    <input
                      id="serviceSectionTitle.small"
                      className={`max-w-[375px] px-1 w-full page-input`}
                      {...register("serviceSectionTitle.small", {
                        required: true,
                      })}
                      placeholder="We Think a lot"
                      defaultValue={
                        homePageData?.serviceSectionTitle?.small || ""
                      }
                    />
                  </h6>
                </div>
                <div className="w-full relative mt-5">
                  <input
                    id="allServiceBtnText"
                    className={`max-w-[200px] wt_fs-md px-7 py-2.5 !rounded-full w-full page-input`}
                    {...register("allServiceBtnText", { required: true })}
                    placeholder="See All Service"
                    defaultValue={homePageData?.allServiceBtnText || ""}
                  />
                </div>
              </div>

              {/* services info */}
              <Link
                href="/settings/services"
                title="Click to update service"
                className="w-full flex flex-col gap-8 lg:gap-10 2xl:gap-12"
              >
                {serviceData?.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </Link>
            </div>
          </Container>
        </section>

        {/* <LargeMarquee /> */}

        <section className="w-full px-5">
          <div className="px-5 flex items-center justify-center min-h-[300px] border border-slate-400 rounded-[10px] ">
            <h4>Update porfolios from the left panel</h4>
          </div>
        </section>

        <section className="w-full px-5 mt-5">
          <div className="px-5 flex items-center justify-center min-h-[300px] border border-slate-400 rounded-[10px] ">
            <h5 className="text-center">
              For slider portfolios udpate porfolios 6 number to 12 number
              portfolios from the left panel
            </h5>
          </div>
        </section>
        <section className="w-full relative mt-5 px-5">
          <input
            id="allProjectBtnText"
            className={`max-w-[210px] wt_fs-md px-7 py-2.5 !rounded-full w-full page-input`}
            {...register("allProjectBtnText", { required: true })}
            placeholder="View All Projects"
            defaultValue={homePageData?.allProjectBtnText || ""}
          />
        </section>
        <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
          <div className="w-full text-center mb-14 md:mb-16 lg:mb-20">
            <h3 className="text-center middle-border">
              <input
                id="leadersSectionTitle"
                className={`max-w-[450px] px-2 text-center py-2.5 w-full page-input`}
                {...register("leadersSectionTitle", { required: true })}
                placeholder="Our Leaders"
                defaultValue={homePageData?.leadersSectionTitle || ""}
              />
            </h3>
          </div>
          <div className="mx-5 px-5 flex items-center justify-center min-h-[100px] border border-slate-400 rounded-[10px]">
            <h4>Update team members from left panel</h4>
          </div>
        </section>
        <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
          <div className="w-full text-center mb-14 md:mb-16 lg:mb-20">
            <h3 className="text-center middle-border">
              <input
                id="teamSectionTitle"
                className={`max-w-[450px] px-2 text-center py-2.5 w-full page-input`}
                {...register("teamSectionTitle", { required: true })}
                placeholder="Our People"
                defaultValue={homePageData?.teamSectionTitle || ""}
              />
            </h3>
          </div>
          <div className="mx-5 px-5 flex items-center justify-center min-h-[100px] border border-slate-400 rounded-[10px]">
            <h4>Update team members from left panel</h4>
          </div>
        </section>

        <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
          <Container>
            <h2 className="heading inline !leading-[100%]">
              <input
                id="blogSectionTitle.large"
                className={`max-w-[575px] w-full page-input`}
                {...register("blogSectionTitle.large", { required: true })}
                placeholder="Updates,"
                defaultValue={homePageData?.blogSectionTitle?.large || ""}
              />
            </h2>
            <div className="mt-1 w-full flex flex-wrap md:flex-nowrap items-end gap-2">
              <h2
                className={`heading !leading-[100%] ${galleryModern.className}`}
              >
                <input
                  id="blogSectionTitle.medium"
                  className={`max-w-[400px] w-full page-input`}
                  {...register("blogSectionTitle.medium", { required: true })}
                  placeholder="Insights"
                  defaultValue={homePageData?.blogSectionTitle?.medium || ""}
                />
              </h2>
              <h6 className="mb-2 2xl:mb-4 heading">
                <input
                  id="blogSectionTitle.small"
                  className={`max-w-[375px] px-1 w-full page-input`}
                  {...register("blogSectionTitle.small", { required: true })}
                  placeholder="Our Newest Articles"
                  defaultValue={homePageData?.blogSectionTitle?.small || ""}
                />
              </h6>
            </div>
            <div className=" section-inner-speacing w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 gap-y-14 md:gap-8 md:gap-y-14 lg:gap-10 lg:gap-y-14">
              {posts?.map((blog) => (
                <BlogCardWrapper
                  key={blog._id}
                  createdAt={blog.createdAt}
                  description={blog.description}
                  slug={blog.slug}
                  thumnail={blog.thumnail.url}
                  title={blog.title}
                  excerpt={blog.excerp}
                >
                  <Link href={`/blog/${blog.slug}`}>
                    <Button label="Read More" className="!text-sm !py-2.5" />
                  </Link>
                </BlogCardWrapper>
              ))}
            </div>
          </Container>
        </section>
        <BottomSlider data={homePageData} setValue={setValue} />

        <Container className="min-h-20 mt-20">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Button className="!py-3" label="Update home page" />
          )}
        </Container>
      </form>
    </div>
  );
}
