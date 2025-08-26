"use client";
import {
    useGetBlogsPageDataQuery,
  useUpdateBlogsPageDataMutation,
} from "@/redux/features/pageData/pageData";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IBlogPage } from "@/types/pageTypes";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/sharedComponets/ui/buttons/Button";
import BannerBackground from "./BannerBackground";

// variables
const bannerDescription =
  "Experience the synergy of design and technology. As a full-service digital partner, we bring your brand to life through transformative digital solutions and captivating experiences";

export default function BlogsPageForm() {
  const { register, setValue, handleSubmit } = useForm<IBlogPage>();
  const { data, isLoading } = useGetBlogsPageDataQuery({});
  const blogsPageData = data?.data || ({} as IBlogPage);
  //  background image change key

  const [updateBlogsPage, { isLoading: loading }] =
    useUpdateBlogsPageDataMutation();

  // handlers
  const onSubmit = async (updateData: IBlogPage) => {
    try {
      const res = await updateBlogsPage({
        id: blogsPageData?._id,
        data: updateData,
      }).unwrap();
      if (res?.success) {
        toast.success("Blogs page data updated");
      } else {
        toast.error("Failed to update blogs page data");
      }
    } catch (error: any) {
      console.log(error, " error updating blogs page data");
      toast.error("Failed to update blogs page data");
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
        <p>Add blogs page data</p>
      </ConditionalReturnContainer>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`w-full`}>
      <section className={`w-full min-h-screen z-0 flex relative items-center`}>
        <Container className="flex !max-w-[1100px] items-center justify-center ">
          <div className="w-full text-center p-2 bg-slate-300/70">
            <h1 className="wt_fs-7xl font-medium heading !leading-[100%]">
              <input
                id="banner.title"
                className="page-input pl-1 text-center w-full !border-slate-800"
                {...register("title", { required: true })}
                placeholder="Our Blog"
                defaultValue={blogsPageData?.title || ""}
              />
            </h1>
            <p className="wt_fs-xl bold mt-5">
              <textarea
                id="banner.description"
                className="page-input text-center px-2 min-h-[140px] w-full !border-slate-800"
                {...register("description", { required: true })}
                placeholder={bannerDescription}
                defaultValue={blogsPageData?.description || ""}
              ></textarea>
            </p>
          </div>
        </Container>

        <BannerBackground
          bannerBG={blogsPageData?.bannerBG}
          setValue={setValue}
        />
      </section>
      <section className="pb-24 mt-10 border-b border-slate-500">
        <Container>
          {loading ? <LoadingSpinner /> : <Button type="submit" label="Save" />}
        </Container>
      </section>
    </form>
  );
}
