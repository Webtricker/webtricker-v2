"use client";
import { useSubmitContactFormMutation } from "@/redux/features/contact/contactApiSlice";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import React from "react";
// import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type fetchedFormData = {
  name: {
    label: string;
    placeholder: string;
  };
  email: {
    label: string;
    placeholder: string;
  };
  message: {
    label: string;
    placeholder: string;
  };
  btnText: string;
  mailTo: string;
};

// ===== root component ======
export default function ContactForm({
  fetchedFormData,
}: {
  fetchedFormData: fetchedFormData;
}) {
  // hooks
  const [submitForm, { isLoading }] = useSubmitContactFormMutation();
  const {
    register,
    // setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  //   handlers
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await submitForm(data).unwrap();
      if (res.success) {
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
      console.error(error);
    } finally {
      reset();
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-5">
      {/* ======= input === */}
      <div className="w-full">
        <label className="block" htmlFor="contactName">
          {fetchedFormData?.name?.label}
        </label>
        <input
          data-wt-hide-cursor
          className="cursor-hide block wt_fs-md w-full py-1.5 mt-1.5 px-4 rounded-[4px] outline-none duration-200 border border-slate-300 focus:border-slate-500 dark:focus:border-slate-300 dark:border-slate-700"
          id="contactName"
          type="text"
          placeholder={fetchedFormData?.name?.placeholder}
          {...register("name", { required: "Name is required" })}
        />
        {errors?.name ? (
          <p className="mt-1 text-red-500">{errors.name.message}</p>
        ) : (
          <></>
        )}
      </div>
      {/* ======= input === */}
      <div className="w-full">
        <label htmlFor="contactEmail">{fetchedFormData?.email?.label}</label>
        <input
          data-wt-hide-cursor
          className="cursor-hide block wt_fs-md w-full py-1.5 mt-1.5 px-4 rounded-[4px] outline-none duration-200 border border-slate-300 focus:border-slate-500 dark:focus:border-slate-300 dark:border-slate-700"
          type="text"
          id="contactEmail"
          placeholder={fetchedFormData?.email?.placeholder}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors?.email ? (
          <p className="mt-1 text-red-500">{errors.email.message}</p>
        ) : (
          <></>
        )}
      </div>
      {/* ======= input === */}
      <div className="w-full">
        <label htmlFor="contactMessage">
          {fetchedFormData?.message?.label}
        </label>
        <textarea
          data-wt-hide-cursor
          id="contactMessage"
          placeholder={fetchedFormData?.message?.placeholder}
          className="cursor-hide min-h-[100px] block wt_fs-md w-full py-1.5 mt-1.5 px-4 rounded-[4px] outline-none duration-200 border border-slate-300 focus:border-slate-500 dark:focus:border-slate-300 dark:border-slate-700"
          {...register("message", { required: "Message is required" })}
        ></textarea>
        {errors?.message ? (
          <p className="mt-1 text-red-500">{errors.message.message}</p>
        ) : (
          <></>
        )}
      </div>
      {/* <div className="w-full">
        <GoogleReCaptcha
                sitekey="6LcWnpgpAAAAAAy0KdI38kGohvMEvWib_SwxzBnX"
                onChange={onChange}
              />
      </div> */}
      <div className="w-full">
        <button
          disabled={isLoading}
          data-wt-hide-cursor
          className="w-full cursor-hide btn-reverse-bg py-2 wt_fs-md px-2 rounded-[4px]"
        >
          {isLoading ? (
            <LoadingSpinner className="w-6 h-6 mx-auto my-1" />
          ) : (
            <span>{fetchedFormData?.btnText}</span>
          )}
        </button>
      </div>
    </form>
  );
}
