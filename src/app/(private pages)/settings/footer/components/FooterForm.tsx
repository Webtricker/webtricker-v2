"use client";
import React from "react";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { useForm } from "react-hook-form";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { toast } from "react-toastify";
import Button from "@/sharedComponets/ui/buttons/Button";
import {
  useGetFooterDataQuery,
  useUpdateFooterDataMutation,
} from "@/redux/features/componentsCustomization/customizationApiSlice";
import { IFooter } from "@/types/componentsType";
import FooterLogos from "./FooterLogos";
import PagesLinks from "./PagesLinks";
import ServicesLinks from "./ServicesLinks";

const footerDes = `Looking for a reliable digital partner? We provide end-to-end solutions—design, development, marketing, SEO, and more. Let&apos;s collaborate for lasting success.`;

export default function FooterForm() {
  //   page data
  const { data, isLoading } = useGetFooterDataQuery({});
  const footerData = data?.data || ({} as IFooter);

  // react hook form
  const { control, register, setValue, handleSubmit } = useForm<IFooter>();

  //   hook to update page data
  const [updateFooterData, { isLoading: loading }] =
    useUpdateFooterDataMutation();

  // handlers
  const onSubmit = async (updateData: IFooter) => {
    console.log(updateData, " update footer data ");
    return;

    try {
      const res = await updateFooterData({
        id: data?.data?._id,
        data: updateData,
      }).unwrap();
      if (res?.success) {
        toast.success("Contact page data updated");
      } else {
        toast.error("Failed to update contact page data");
      }
    } catch (error: any) {
      console.log(error, " error updating contact page data");
      toast.error("Failed to update contact page data");
    }
  };

  // useEffect(() => {
  //   reset(contactPageData);
  // }, []);

  if (isLoading)
    return (
      <ConditionalReturnContainer>
        <LoadingSpinner />
      </ConditionalReturnContainer>
    );

  if (!data)
    return (
      <ConditionalReturnContainer>
        <p>Add footer data</p>
      </ConditionalReturnContainer>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18"
    >
      <Container className="flex flex-col gap-20">
        <div className="w-full max-w-[600px]">
          <FooterLogos setValue={setValue} logo={footerData?.logo} />
          <p className="mt-3 wt_fs-md">
            <textarea
              id="description"
              className="page-input w-full min-w-[290px] text-left pl-1 leading_normal min-h-[120px]"
              {...register("description", { required: true })}
              placeholder={footerDes}
            ></textarea>
          </p>
        </div>

        {/* === our pages ==== */}
        <div className="w-full">
          <h5>
            <input
              id="pages.title"
              className="page-input w-full max-w-[300px] pl-1 py-1 leading_normal"
              {...register("pages.title", { required: true })}
              placeholder="Our Pages"
            />
          </h5>
          <div className="mt-3 items-start flex flex-col gap-2 w-full wt_fs-md">
            <PagesLinks control={control} register={register} />
          </div>
        </div>

        {/* ===== our services == */}
        <div className="w-full">
          <h5>
              <input
              id="services.title"
              className="page-input w-full max-w-[300px] pl-1 py-1 leading_normal"
              {...register("services.title", { required: true })}
              placeholder="Our services"
            />
            </h5>
          <div className="mt-3 items-start flex flex-col gap-2 w-full wt_fs-md">
            <ServicesLinks control={control} register={register} />
          </div>
        </div>

        {/* ==== social links ====== */}

        <div className="w-full">
          <h5>
             <input
              id="socialLinks.title"
              className="page-input w-full max-w-[300px] pl-1 py-1 leading_normal"
              {...register("socialLinks.title", { required: true })}
              placeholder="Follow Us on"
            />
            </h5>
          <div className="flex gap-5 md:gap-7 w-full mt-3">
            {/* TODO: ============= */}
            {/* <SocialLinks /> */}
          </div>
          <div className="w-full mt-7">
            <label className="wt_fs-md">Subscribe to our newsletter:</label>
            {/* <NewsLetterForm /> */}
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          {/* <BouncingText
              size="wt_fs-7xl"
              text="Contact Us"
              interval={100}
              duration={4}
            /> */}
        </div>

        <div className="w-full h-[1px] bg-slate-400/40 dark:bg-slate-800"></div>
        <div className="text-center mt-5 lg:mt-10">
          <p>
            All rights reserved — {new Date().getFullYear()} &copy; Webtricker
          </p>
        </div>
      </Container>
      <section className="section ">
        <Container>
          {loading ? <LoadingSpinner /> : <Button label="Save" />}
        </Container>
      </section>
    </form>
  );
}
