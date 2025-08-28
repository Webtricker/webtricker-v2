"use client";
import {
  useGetPortfoliosPageDataQuery,
  useUpdatePortfoliosPageDataMutation,
} from "@/redux/features/pageData/pageData";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IPortfolioPage, IServicesPage } from "@/types/pageTypes";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/sharedComponets/ui/buttons/Button";
import BannerSlider from "./BannerSlider";

// variables
const projectIntroductionDes =
  "We’re a diverse team that works as fancies attention to details, enjoys beers on Friday nights and aspires to design the dent in the universe.";

export default function PortfolioPageFrom() {
  const { register, setValue, handleSubmit } = useForm<IPortfolioPage>();
  const { data, isLoading } = useGetPortfoliosPageDataQuery({});
  const portfolioPageData = data?.data || ({} as IServicesPage);
  //  background image change key

  const [updatePortfolioPage, { isLoading: loading }] =
    useUpdatePortfoliosPageDataMutation();

  // handlers
  const onSubmit = async (updateData: IPortfolioPage) => {
    console.log(updateData, " updated data");
    try {
      const res = await updatePortfolioPage({
        id: portfolioPageData?._id,
        data: updateData,
      }).unwrap();
      if (res?.success) {
        toast.success("Portfolio page data updated");
      } else {
        toast.error("Failed to update Portfolio page data");
      }
    } catch (error: any) {
      console.log(error, " error updating portfolio page data");
      toast.error("Failed to update portfolio page data");
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
        <p>Add portfolio data</p>
      </ConditionalReturnContainer>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`w-full border-b`}>
      <BannerSlider bannerSlider={portfolioPageData?.bannerSlider || []} setValue={setValue} />
      <section className="section-speacing">
        <Container className="!max-w-[1200px]">
          <p className="bold flex items-center gap-1">
            <span>
              {" "}
              <input
                id="projectIntroduction.companyName"
                className="page-input pl-1 w-full"
                {...register("projectIntroduction.companyName", {
                  required: true,
                })}
                placeholder="Webtricker Studio"
                defaultValue={
                  portfolioPageData?.projectIntroduction?.companyName || ""
                }
              ></input>
            </span>
            <span className="w-10 h-[1px] mt-1.5 bg-black dark:bg-white"></span>
          </p>
          <h2 className="heading xl:font-semibold !leading-[100%] mt-2">
            <textarea
              id="projectIntroduction.title"
              className="page-input pl-1 w-full min-h-[220px]"
              {...register("projectIntroduction.title", {
                required: true,
              })}
              placeholder="Our latest & great projects"
              defaultValue={portfolioPageData?.projectIntroduction?.title || ""}
            ></textarea>
          </h2>
          <p className="mx-auto max-w-[500px] mt-5">
            <textarea
              id="projectIntroduction.description"
              className="page-input pl-1 w-full min-h-[90px]"
              {...register("projectIntroduction.description", {
                required: true,
              })}
              placeholder={projectIntroductionDes}
              defaultValue={
                portfolioPageData?.projectIntroduction?.description || ""
              }
            ></textarea>
          </p>
        </Container>
      </section>
      <section className="pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18 pb-5">
        <Container className="w-full flex flex-col">
          <p className="bold text-center mb-2">
            <input
              id="bottomText.expression"
              className="page-input text-center max-w-[550px] w-full pl-1"
              {...register("bottomText.expression", {
                required: true,
              })}
              placeholder="DIGITAL DESIGN EXPERIENCE CREATIVE STUDIO"
              defaultValue={portfolioPageData?.bottomText?.expression || ""}
            />
          </p>
          <h2 className="wt_fs-big text-center heading">
            <input
              id="bottomText.title"
              className="page-input text-center w-full pl-1"
              {...register("bottomText.title", {
                required: true,
              })}
              placeholder="GET IN TOUCH"
              defaultValue={portfolioPageData?.bottomText?.title || ""}
            />
          </h2>
        </Container>
      </section>
      <section className="pb-24">
        <Container>
          {loading ? <LoadingSpinner /> : <Button type="submit" label="Save" />}
        </Container>
      </section>
    </form>
  );
}
