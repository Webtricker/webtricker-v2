"use client";
import { useSubmitLoginFormMutation } from "@/redux/features/auth/LoginApiSlice";
import SiteLogo from "@/sharedComponets/ui/header/SiteLogo";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import React, { useState } from "react";
// import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { EyeCloseIcon, EyeOpenIcon } from "./Icons";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/utils/auth";

type IError = {
  status: number;
  data: {
    message: string;
    success: boolean;
    error: boolean;
  };
};

type FormData = {
  email: string;
  password: string;
};

// ===== root component ======
type Props = {
  navStyle?: string;
  children: React.ReactNode;
};
export default function LoginForm({children}:Props) {
  // hooks
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitForm, { isLoading }] = useSubmitLoginFormMutation();
  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  //   handlers
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await submitForm(data).unwrap();
      console.log(res)
      if (!res?.success) {
        throw {
          status: 400,
          data: res?.data || {},
        } as IError;
      }
      toast.success("Login Successful!");
      reset();
      setAccessToken(res.token);
      // Redirect to admin dashboard
      router.push("/settings");
    } catch (error: any) {
      console.log(error);
      setError("password", {
        type: "manual",
        message: error?.data?.message || "Login failed",
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="relative duration-200 bg-slate-50 dark:bg-slate-900 shadow dark:shadow-slate-100/10 p-10 rounded-[10px] w-full flex flex-col gap-5"
    >
      <div className="w-full flex items-center justify-center mb-5">
        <SiteLogo className="!w-auto">
          {children}
        </SiteLogo>
      </div>
      <h1 className="absolute opacity-0 pointer-events-none wt_fs-2xl">
        Admin Login
      </h1>

      {/* ======= input === */}
      <div className="w-full">
        <label htmlFor="contactEmail">Email</label>
        <input
          data-wt-hide-cursor
          className="cursor-hide block wt_fs-md w-full py-1.5 mt-1.5 px-4 rounded-[4px] outline-none duration-200 border border-slate-300 focus:border-slate-500 dark:focus:border-slate-300 dark:border-slate-700"
          type="text"
          id="contactEmail"
          placeholder="Enter your email "
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
        <label className="block" htmlFor="contactName">
          Password
        </label>
        <div className="w-full relative z-0">
          <input
            data-wt-hide-cursor
            className="z-0 cursor-hide block wt_fs-md w-full py-1.5 mt-1.5 px-4 rounded-[4px] outline-none duration-200 border border-slate-300 focus:border-slate-500 dark:focus:border-slate-300 dark:border-slate-700"
            id="contactName"
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              min: 6,
              max: 20,
            })}
          />

          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="z-10 absolute top-[50%] right-4 translate-y-[-50%]"
          >
            {showPass ? (
              <EyeOpenIcon className="w-5 h-5" />
            ) : (
              <EyeCloseIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors?.password ? (
          <p className="mt-1 text-red-500">{errors.password?.message}</p>
        ) : (
          <></>
        )}
      </div>
      {/* ======= submit button === */}
      <div className="w-full">
        <button
          disabled={isLoading}
          data-wt-hide-cursor
          className="w-full cursor-hide btn-reverse-bg py-2 wt_fs-md px-2 rounded-[4px]"
        >
          {isLoading ? (
            <LoadingSpinner className="w-6 h-6 mx-auto my-1" />
          ) : (
            <span>Login</span>
          )}
        </button>
      </div>
    </form>
  );
}
