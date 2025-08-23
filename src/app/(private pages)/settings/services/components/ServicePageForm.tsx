"use client";
import {
  useGetServicesPageDataQuery,
  useUpdateServicesPageDataMutation,
} from "@/redux/features/pageData/pageData";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IServicesPage } from "@/types/pageTypes";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BannerBackground from "./BannerBackground";

// variables
const bannerDescription =
  "Our rich design and technology expertise delivers top brands and digital experiences Services list";

export default function ServicePageForm() {
  const { register, setValue, handleSubmit } = useForm<IServicesPage>();
  const { data, isLoading } = useGetServicesPageDataQuery({});
  const servicePageData = data?.data || ({} as IServicesPage);
  //  background image change key

  const [updateAboutPage, { isLoading: loading }] =
    useUpdateServicesPageDataMutation();

  // handlers
  const onSubmit = async (updateData: IServicesPage) => {
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
        <p>Add Service page data</p>
      </ConditionalReturnContainer>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`w-full`}>
      <section className={`w-full min-h-screen z-0 flex relative items-center`}>
        <Container className="flex items-center justify-center ">
          <div className="w-full max-w-[1000px] text-center p-2 bg-slate-300/70">
            <h1 className="wt_fs-7xl font-medium heading !leading-[100%]">
              <textarea
                id="banner.title"
                className="page-input pl-1 min-h-[220px] text-center w-full !border-slate-800"
                {...register("banner.title", { required: true })}
                placeholder=" A full-service digital innovation partner"
                defaultValue={servicePageData?.banner?.title || ""}
              ></textarea>
            </h1>
            <p className="wt_fs-xl bold mt-5">
              <textarea
                id="banner.title"
                className="page-input text-center px-2 min-h-[80px] w-full !border-slate-800"
                {...register("banner.title", { required: true })}
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
    </form>
  );
}
