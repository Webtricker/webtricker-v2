"use client";
import {
  useGetServicesPageDataQuery,
  useUpdateServicesPageDataMutation,
} from "@/redux/features/pageData/pageData";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IServicesPage } from "@/types/pageTypes";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BannerBackground from "./BannerBackground";
import ServiceIcon from "./ServiceIcon";
import Button from "@/sharedComponets/ui/buttons/Button";

// variables
const bannerDescription =
  "Our rich design and technology expertise delivers top brands and digital experiences Services list";
const serviceShotcutDes =
  "We strongly believe that only design reinforced by strategy can provide real results.";

export default function ServicePageForm() {
  const { register, setValue, reset, handleSubmit } = useForm<IServicesPage>();
  const { data, isLoading } = useGetServicesPageDataQuery({});
  const servicePageData = data?.data || ({} as IServicesPage);

  const [updateServicePage, { isLoading: loading }] =
    useUpdateServicesPageDataMutation();


  useEffect(() => {
    if (data?.data) {
      reset(data?.data);
    }
  }, [data?.data, reset]);

  // handlers
  const onSubmit = async (updateData: IServicesPage) => {
    try {

      const res = await updateServicePage({
        id: servicePageData?._id,
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
        <p>Add Service page data</p>
      </ConditionalReturnContainer>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`w-full`}>
      <section className={`w-full min-h-screen z-0 flex relative items-center`}>
        <Container className="flex !max-w-[1100px] items-center justify-center ">
          <div className="w-full text-center p-2 bg-slate-300/70">
            <h1 className="wt_fs-7xl font-medium heading !leading-[100%]">
              <textarea
                id="banner.title"
                className="page-input pl-1 min-h-[220px] text-center w-full !border-slate-800"
                {...register("banner.title", { required: true })}
                placeholder="A full-service digital innovation partner"
                defaultValue={servicePageData?.banner?.title || ""}
              ></textarea>
            </h1>
            <p className="wt_fs-xl bold mt-5">
              <textarea
                id="banner.description"
                className="page-input text-center px-2 min-h-[80px] w-full !border-slate-800"
                {...register("banner.description", { required: true })}
                placeholder={bannerDescription}
                defaultValue={servicePageData?.banner?.description || ""}
              ></textarea>
            </p>
          </div>
        </Container>

        <BannerBackground
          bannerBG={servicePageData?.bannerBG}
          setValue={setValue}
        />
      </section>
      <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <Container>
          <p className="w-full flex items-center gap-2 wt_fs-md">
            <ServiceIcon data={servicePageData} setValue={setValue} />
            <span>
              <input
                id="servicesShotcut.subtitle"
                className="page-input pl-1 w-full !border-slate-800"
                {...register("servicesShotcut.subtitle", { required: true })}
                placeholder="Services"
                defaultValue={servicePageData?.servicesShotcut?.subtitle || ""}
              ></input>
            </span>
          </p>
          <h4 className="heading !leading-[100%] max-w-[850px] mt-2">
            <textarea
              id="servicesShotcut.title"
              className="page-input px-2 min-h-[92px] w-full !border-slate-800"
              {...register("servicesShotcut.title", { required: true })}
              placeholder={serviceShotcutDes}
              defaultValue={servicePageData?.servicesShotcut?.title || ""}
            ></textarea>
          </h4>
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
              defaultValue={servicePageData?.bottomText?.expression || ""}
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
              defaultValue={servicePageData?.bottomText?.title || ""}
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


