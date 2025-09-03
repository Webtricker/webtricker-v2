"use client";
import React, { useEffect } from "react";
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
import GreetingImages from "./GreetingImages";
import LeftPanelBtns from "./LeftPanelBtns";
import AddressIcons from "./AddressIcons";
import Addresses from "./Addresses";
import ContactIcon from "./ContactIcon";
import MailIcon from "./MailIcon";
import Mails from "./Mails";
import Phones from "./Phone";

export default function ContactPageForm() {
  //   page data
  const { data, isLoading } = useGetContactPageDataQuery({});
  const contactPageData = data?.data || ({} as IContactPage);

  // react hook form
  const { control, watch, reset, register, setValue, handleSubmit } =
    useForm<IContactPage>();

  //   hook to update page data
  const [updateContactPage, { isLoading: loading }] =
    useUpdateContactPageDataMutation();

  // handlers
  const onSubmit = async (updateData: IContactPage) => {
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

  useEffect(() => {
    if (data?.data) {
      reset(data?.data);
    }
  }, [data?.data, reset]);

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

  const icons = {
    white: contactPageData?.greetings?.white || "",
    black: contactPageData?.greetings?.black || "",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`w-full`}>
      <div className={`relative w-full mt-[130px]`}>
        <Container>
          <div className="w-full max-w-[1120px] mx-auto">
            <p className="bold mb-2 flex items-center gap-1">
              <span>
                <input
                  id="branding"
                  className="page-input w-full min-w-[290px] pl-1 leading_normal"
                  {...register("branding", { required: true })}
                  placeholder="Webtricker Web & Design Solutions"
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
                  />
                </h6>
                <div className="w-full flex items-start mt-2">
                  <p className="bold whitespace-nowrap">
                    <input
                      id="greetings.bottomTxt"
                      className="page-input w-full pl-1 leading_normal"
                      {...register("greetings.bottomTxt", { required: true })}
                      placeholder="WRITE TO US"
                    />
                  </p>
                  <div className="hidden sm:block w-full mt-4">
                    <GreetingImages icons={icons} setValue={setValue} />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-5">
                {/* ======= input === */}
                <div className="w-full">
                  <label className="block mb-2" htmlFor="contactName">
                    <input
                      id="form.name.label"
                      className="page-input py-1.5 pl-1 w-full leading_normal"
                      {...register("form.name.label", { required: true })}
                      placeholder="label ex:Name"
                    />
                  </label>
                  <input
                    id="form.name.placeholder"
                    className="page-input py-1.5 w-full pl-1 leading_normal"
                    {...register("form.name.placeholder", { required: true })}
                    placeholder="placeholder ex: Your name"
                  />
                </div>
                {/* ======= input === */}
                <div className="w-full">
                  <label className="block mb-2" htmlFor="contactEmail">
                    <input
                      id="form.email.label"
                      className="page-input py-1.5 w-full pl-1 leading_normal"
                      {...register("form.email.label", { required: true })}
                      placeholder="label ex: Email"
                    />
                  </label>
                  <input
                    id="form.email.placeholder"
                    className="page-input py-1.5 w-full pl-1 leading_normal"
                    {...register("form.email.placeholder", {
                      required: true,
                    })}
                    placeholder="placeholder: email@company.com"
                  />
                </div>
                {/* ======= input === */}
                <div className="w-full">
                  <label className="block mb-2" htmlFor="contactMessage">
                    <input
                      id="form.message.label"
                      className="page-input py-1.5 w-full pl-1 leading_normal"
                      {...register("form.message.label", { required: true })}
                      placeholder="label ex: Your Queries"

                    />
                  </label>
                  <input
                    id="form.message.placeholder"
                    className="page-input w-full py-1.5 pl-1 leading_normal"
                    {...register("form.message.placeholder", {
                      required: true,
                    })}
                    placeholder="placeholder: Let'us know how we can help you"
                  />
                </div>
                <div className="w-full">
                  <input
                    id="form.btnText"
                    className="page-input bg-black text-center py-1.5 dark:bg-white text-white dark:text-black w-full pl-1 leading_normal"
                    {...register("form.btnText", { required: true })}
                    placeholder="Send Message"
                  />
                </div>
                <div className="w-full">
                  <input
                    id="form.btnText"
                    className="page-input  py-1.5 w-full pl-1 leading_normal"
                    {...register("form.btnText", { required: true })}
                    placeholder="mailto:"
                  />
                </div>
              </div>
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
            />
          </p>
        </div>
      </div>
      <div className="w-full py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <Container className="">
          <h4 className="heading 2xl:font-semibold !leading-[100%]">
            <input
              id="contactInformationTitle"
              className="page-input w-full pl-1 leading_normal max-w-[600px]"
              {...register("contactInformationTitle", { required: true })}
              placeholder="Contact Information"
            />
          </h4>
          <div className="w-full flex flex-col lg:flex-row gap-10 md:gap-14 2xl:gap-20 ">
            <div className="w-full flex flex-col gap-8 lg:gap-10 max-w-[550px]">
              <div className="w-full flex gap-2 mt-10 items-start">
                <AddressIcons
                  icons={{
                    white: contactPageData?.address?.iconWhite,
                    black: contactPageData?.address?.iconBlack,
                  }}
                  setValue={setValue}
                />
                <div className="grow not-italic">
                  <h6 className="heading mb-1">
                    <input
                      id="address.title"
                      className="page-input w-full pl-1 py-1 leading_normal max-w-[600px]"
                      {...register("address.title", {
                        required: true,
                      })}
                      placeholder="Address"
                    />
                  </h6>
                  <Addresses register={register} control={control} />
                </div>
              </div>

              <div className="w-full flex gap-2 mt-10 items-start">
                <ContactIcon
                  icons={{
                    white: contactPageData?.address?.iconWhite,
                    black: contactPageData?.address?.iconBlack,
                  }}
                  setValue={setValue}
                />
                <div className="grow not-italic">
                  <h6 className="heading mb-1">
                    <input
                      id="contactNumber.title"
                      className="page-input w-full pl-1 py-1 leading_normal max-w-[600px]"
                      {...register("contactNumber.title", {
                        required: true,
                      })}
                      placeholder="Phone"
                    />
                  </h6>
                  <Phones register={register} control={control} />
                </div>
              </div>

              <div className="w-full flex gap-2 mt-10 items-start">
                <MailIcon
                  icons={{
                    white: contactPageData?.contactMails?.iconWhite,
                    black: contactPageData?.contactMails?.iconBlack,
                  }}
                  setValue={setValue}
                />
                <div className="grow not-italic">
                  <h6 className="heading mb-1">
                    <input
                      id="contactMails.title"
                      className="page-input w-full pl-1 py-1 leading_normal max-w-[600px]"
                      {...register("contactMails.title", {
                        required: true,
                      })}
                      placeholder="Email"
                    />
                  </h6>
                  <Mails register={register} control={control} />
                </div>
              </div>
            </div>

            {/* ======= map ======== */}
            <div className="w-full overflow-hidden">
              <h6 className="heading mb-5">
                <input
                  id="googleMap.title"
                  className="page-input w-full pl-1 py-1 leading_normal max-w-[600px]"
                  {...register("googleMap.title", {
                    required: true,
                  })}
                  placeholder="Find us on google map:"
                />
              </h6>
              <div className="w-full relative z-0">
                <iframe
                  className="min-h-[400px] z-10"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14474.096950431665!2d89.941474!3d24.914205!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fd7f5ce07e179d%3A0x209802aa6366f9da!2sWebtricker%20Web%20Design%20%26%20Development%20Agency!5e0!3m2!1sen!2sus!4v1693518943068!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  loading="lazy"
                ></iframe>

                <div className="w-full h-full absolute top-0 left-0 bg-slate-900/30 flex items-center justify-center z-50">
                  <textarea
                    id="googleMap.iframe"
                    className="page-input w-full leading_normal max-w-[700px] min-h-[200px] bg-white text-black p-4 rounded-[8px]"
                    {...register("googleMap.iframe", {
                      required: true,
                    })}
                    placeholder="Enter google map iframe url"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <section className="section ">
        {loading ? <LoadingSpinner /> : <Button type="submit" label="Save" />}
      </section>
    </form>
  );
}
