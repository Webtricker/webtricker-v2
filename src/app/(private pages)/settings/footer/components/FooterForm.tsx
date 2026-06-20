"use client";
import React, { useEffect } from "react";
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
import SocialLinks from "./SocialLinks";
import DeprecatedSiteConfigNotice from "@/dashboard/DeprecatedSiteConfigNotice";

const footerDes = `Looking for a reliable digital partner? We provide end-to-end solutions—design, development, marketing, SEO, and more. Let&apos;s collaborate for lasting success.`;

export default function FooterForm() {
  //   page data
  const { data, isLoading } = useGetFooterDataQuery({});
  const footerData = data?.data || ({} as IFooter);

  // react hook form
  const { control, reset, register, watch, setValue, handleSubmit } =
    useForm<IFooter>();

  //   hook to update page data
  const [updateFooterData, { isLoading: loading }] =
    useUpdateFooterDataMutation();

  // handlers
  const onSubmit = async (updateData: IFooter) => {
    console.log(updateData, " udated");
    try {
      const res = await updateFooterData({
        id: data?.data?._id,
        data: updateData,
      }).unwrap();
      if (res?.success) {
        toast.success("footer data updated");
      } else {
        toast.error("Failed to update footer data");
      }
    } catch (error: any) {
      console.log(error, " error updating footer data");
      toast.error("Failed to update footer data");
    }
  };

  useEffect(() => {
    if (data?.data) {
      reset(data?.data);
    }
  }, [data, reset]);

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
          <DeprecatedSiteConfigNotice />
          <div className="flex gap-5 md:gap-7 w-full mt-3">
            {/* TODO: ============= */}
            <SocialLinks
              watch={watch}
              control={control}
              register={register}
              setValue={setValue}
            />
          </div>
          <div className="w-full mt-7">
            <label className="wt_fs-md">
              <input
                id="newsLater.title"
                className="page-input w-full max-w-[300px] pl-1 py-1 leading_normal"
                {...register("newsLater.title", { required: true })}
                placeholder="Subscribe to our newsletter:"
              />
            </label>
            <br />
            <input
              id="newsLater.placeholder"
              className="page-input w-full max-w-[300px] pl-1 py-1 leading_normal mt-4"
              {...register("newsLater.placeholder", { required: true })}
              placeholder="Placeholder text"
            />
            <br />
            <input
              id="newsLater.formMail"
              className="page-input w-full max-w-[300px] pl-1 py-1 leading_normal mt-4"
              {...register("newsLater.formMail", { required: true })}
              placeholder="Enter receiver email"
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <h2 className="wt_fs-7xl">
            <input
              id="bounchingTxt"
              className="page-input w-full max-w-[800px] text-center pl-1 py-1 leading_normal mt-4"
              {...register("bounchingTxt", { required: true })}
              placeholder="Contact Us"
            />
          </h2>
        </div>

        <div className="w-full h-[1px] bg-slate-400/40 dark:bg-slate-800"></div>
        <div className="text-center my-5 lg:my-10">
          <p>
            <input
              id="copyrightTxt"
              className="page-input w-full max-w-[800px] text-center pl-1 py-1 leading_normal mt-4"
              {...register("copyrightTxt", { required: true })}
              placeholder="Copy right text"
            />
          </p>
          <p>
            Use the word{" "}
            <span className="text-yellow-400 font-semibold">{"Dynamic"}</span>{" "}
            where you want to dynamically show the current year.
          </p>
        </div>
      </Container>
      <section className="section ">
        <Container>
          {loading ? <LoadingSpinner /> : <Button type="submit" label="Save" />}
        </Container>
      </section>
    </form>
  );
}
