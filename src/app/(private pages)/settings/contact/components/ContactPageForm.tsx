"use client";
import React from "react";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IContactPage } from "@/types/pageTypes";
import {
  useGetContactPageDataQuery,
  useUpdateContactPageDataMutation,
} from "@/redux/features/pageData/pageData";
import { useForm } from "react-hook-form";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { toast } from "react-toastify";
import Button from "@/sharedComponets/ui/buttons/Button";
import ContactForm from "@/app/(public pages)/contact/components/ContactForm";
import {
  EmailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/app/(public pages)/contact/components/Icons";
import Link from "next/link";
import GreetingImages from "./GreetingImages";
import LeftPanelBtns from "./LeftPanelBtns";

export default function ContactPageForm() {
  // react hook form
  const { control, watch, register, setValue, handleSubmit } =
    useForm<IContactPage>();

  //   page data
  const { data, isLoading } = useGetContactPageDataQuery({});
  const contactPageData = data?.data || ({} as IContactPage);

  //   hook to update page data
  const [updateContactPage, { isLoading: loading }] =
    useUpdateContactPageDataMutation();

  // handlers
  const onSubmit = async (updateData: IContactPage) => {
    console.log(updateData, " update data ");
    try {
      const res = await updateContactPage({
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

  if (isLoading)
    return (
      <ConditionalReturnContainer>
        <LoadingSpinner />
      </ConditionalReturnContainer>
    );

  if (!data)
    return (
      <ConditionalReturnContainer>
        <p>Add contact page data</p>
      </ConditionalReturnContainer>
    );

  // <textarea
  //               id="introText"
  //               className="page-input w-full  min-h-[450px] pl-1"
  //               {...register("introText", { required: true })}
  //               placeholder={defaultIntroText}
  //               defaultValue={contactPageData?.introText || ""}
  //             ></textarea>

  // <input
  //                 id="ourMissionText"
  //                 className="page-input w-full pl-1 leading_normal"
  //                 {...register("ourMissionText", { required: true })}
  //                 placeholder="Our mission"
  //                 defaultValue={contactPageData?.ourMissionText || ""}
  //               />

  console.log(contactPageData, " contact page data");

  const icons = {
    white: contactPageData?.greetings?.white || "",
    black: contactPageData?.greetings?.black || "",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`w-full`}>
      <div
        className={`relative w-full mt-[130px]`}
      >
        <Container>
          <div className="w-full max-w-[1120px] mx-auto">
            <p className="bold mb-2 flex items-center gap-1">
              <span>
                <input
                  id="branding"
                  className="page-input w-full min-w-[290px] pl-1 leading_normal"
                  {...register("branding", { required: true })}
                  placeholder="Webtricker Web & Design Solutions"
                  defaultValue={contactPageData?.branding || ""}
                />
              </span>
              <span className="w-10 h-[1px] mt-1.5 bg-black dark:bg-white"></span>
            </p>
            <h1 className="heading xl:font-semibold !leading-[100%]">
              <input
                id="title"
                className="page-input w-full pl-1 leading_normal"
                {...register("title", { required: true })}
                placeholder="Get in touch"
                defaultValue={contactPageData?.title || ""}
              />
            </h1>
            <div className="w-full max-w-[900px] ml-auto flex flex-col gap-5 sm:flex-row pt-8 md:pt-10">
              <div className="w-full">
                <h6 className="bold">
                  <input
                    id="greetings.topTxt"
                    className="page-input w-full pl-1 leading_normal"
                    {...register("greetings.topTxt", { required: true })}
                    placeholder="SAY HELLO TO US"
                    defaultValue={contactPageData?.greetings?.topTxt || ""}
                  />
                </h6>
                <div className="w-full flex items-start mt-2">
                  <p className="bold whitespace-nowrap">
                    <input
                      id="greetings.bottomTxt"
                      className="page-input w-full pl-1 leading_normal"
                      {...register("greetings.bottomTxt", { required: true })}
                      placeholder="WRITE TO US"
                      defaultValue={contactPageData?.greetings?.bottomTxt || ""}
                    />
                  </p>
                  <div className="hidden sm:block w-full mt-4">
                    <GreetingImages icons={icons} setValue={setValue} />
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </Container>
        <div className="hidden lg:flex rotate-90 max-w-[350px] absolute bottom-[10%] -left-[9%] items-center gap-5">
          <div className="flex relative -rotate-90 border w-5 h-5 ">
            <LeftPanelBtns
              setValue={setValue}
              register={register}
              control={control}
              watch={watch}
            />
          </div>
          <span className="w-20 h-[1px] bg-black dark:bg-white"></span>
          <p className="wt_fs-sm whitespace-nowrap">
            <input
              id="leftPanel.text"
              className="page-input w-full pl-1 leading_normal"
              {...register("leftPanel.text", { required: true })}
              placeholder="Follow us"
              defaultValue={contactPageData?.leftPanel?.text || ""}
            />
          </p>
        </div>
      </div>
      <div className="w-full py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <Container className="">
          <h4 className="heading 2xl:font-semibold !leading-[100%]">
            <input
              id="contactInformationTitle"
              className="page-input w-full pl-1 leading_normal"
              {...register("contactInformationTitle", { required: true })}
              placeholder="Contact Information"
              defaultValue={contactPageData?.contactInformationTitle || ""}
            />
          </h4>
          <div className="w-full flex flex-col lg:flex-row gap-10 md:gap-14 2xl:gap-20 ">
            <div className="w-full flex flex-col gap-8 lg:gap-10 max-w-[550px]">
              <div className="w-full flex gap-5 mt-10 items-start">
                <MapPinIcon className="min-w-5 w-6" />
                <div className="grow not-italic">
                  <h6 className="heading mb-1">Address</h6>
                  <address className="not-italic">
                    <strong>US Office</strong>: Hurst, Texas, United States
                  </address>
                  <address className="not-italic">
                    <strong>Dhaka Office</strong>: KHL Laboni&apos;s Dream,
                    Plot-06, Afroza Begum Rd, Dhaka 1229
                  </address>
                  <address className="not-italic">
                    <strong>Jamalpur Office</strong>: House No-46, Zia College
                    Moar, Beside Sohid Minar, Jamalpur, Bangladesh.
                  </address>
                </div>
              </div>
              <div className="w-full flex gap-5 items-start">
                <PhoneIcon className="min-w-5 w-6 mt-1" />
                <div className="grow">
                  <h6 className="heading mb-1">Phone</h6>
                  <a
                    href="tel:+8809639237100"
                    className="block animate-underline w-fit"
                  >
                    +8809639237100
                  </a>
                  <a
                    href="tel:+8809639237101"
                    className="block animate-underline w-fit"
                  >
                    +8809639237101
                  </a>
                  <a
                    href="tel:+16824726184"
                    className="block animate-underline w-fit"
                  >
                    +1 (682) 472-6184
                  </a>
                  <a
                    href="tel:+8801712377577"
                    className="block animate-underline w-fit"
                  >
                    +8801712377577
                  </a>
                  <a
                    href="tel+8801785696469:"
                    className="block animate-underline w-fit"
                  >
                    +8801785696469
                  </a>
                  <a
                    href="tel:+8801793544335"
                    className="block animate-underline w-fit"
                  >
                    +8801793544335
                  </a>
                </div>
              </div>
              <div className="w-full flex gap-5 items-start">
                <EmailIcon className="min-w-5 w-6 mt-1" />
                <div className="grow flex flex-col">
                  <h6 className="heading mb-1">Email</h6>
                  <Link
                    title="Email"
                    href="mailto:info@webtricker.com"
                    className="animate-underline w-fit"
                  >
                    info@webtricker.com
                  </Link>
                  <Link
                    title="Email"
                    href="mailto:inquiry@webtricker.com"
                    className="animate-underline w-fit "
                  >
                    inquiry@webtricker.com
                  </Link>
                  <Link
                    title="Email"
                    href="mailto:career@webtricker.com"
                    className="animate-underline w-fit"
                  >
                    career@webtricker.com
                  </Link>
                  <Link
                    title="Email"
                    href="mailto:admin@webtricker.com"
                    className="animate-underline w-fit"
                  >
                    admin@webtricker.com
                  </Link>
                </div>
              </div>
            </div>

            {/* ======= map ======== */}
            <div className="w-full overflow-hidden rounded-[10px]">
              <h6 className="heading mb-5">Find us on google map:</h6>
              <iframe
                className="min-h-[400px]"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14474.096950431665!2d89.941474!3d24.914205!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fd7f5ce07e179d%3A0x209802aa6366f9da!2sWebtricker%20Web%20Design%20%26%20Development%20Agency!5e0!3m2!1sen!2sus!4v1693518943068!5m2!1sen!2sus"
                width="100%"
                height="100%"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </Container>
      </div>
      <section className="section ">
        {loading ? <LoadingSpinner /> : <Button label="Save" />}
      </section>
    </form>
  );
}
