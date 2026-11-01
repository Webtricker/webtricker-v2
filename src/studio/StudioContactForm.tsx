"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSubmitContactFormMutation } from "@/redux/features/contact/contactApiSlice";
import { useBotCheck } from "@/sharedComponets/ui/security/useBotCheck";

type FormData = { name: string; email: string; message: string };
type Cfg = {
  name?: { label?: string; placeholder?: string };
  email?: { label?: string; placeholder?: string };
  message?: { label?: string; placeholder?: string };
  btnText?: string;
};

/** Contact form in the Studio style. Same API, captcha and validation as the live form. */
export default function StudioContactForm({ cfg }: { cfg?: Cfg }) {
  const [submitForm, { isLoading }] = useSubmitContactFormMutation();
  const bot = useBotCheck();
  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    if (!bot.isAnswered) {
      toast.error("Please answer the security question.");
      return;
    }
    try {
      const res = await submitForm({ ...data, ...bot.getPayload() }).unwrap();
      if (res.success) {
        toast.success("Message sent successfully!");
        reset();
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message. Please try again later.");
    } finally {
      void bot.refresh();
    }
  });

  const err = (m?: string) => (m ? <p className="form__msg" style={{ color: "var(--amber)" }}>{m}</p> : null);

  return (
    <form className="form glass" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="cName">{cfg?.name?.label || "Name"}</label>
        <input id="cName" type="text" autoComplete="name" placeholder={cfg?.name?.placeholder || "Your Name"} {...register("name", { required: "Name is required" })} />
        {err(errors.name?.message)}
      </div>
      <div className="field">
        <label htmlFor="cEmail">{cfg?.email?.label || "Email"}</label>
        <input
          id="cEmail"
          type="email"
          autoComplete="email"
          placeholder={cfg?.email?.placeholder || "email@company.com"}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email format" },
          })}
        />
        {err(errors.email?.message)}
      </div>
      <div className="field">
        <label htmlFor="cMsg">{cfg?.message?.label || "Your Queries"}</label>
        <textarea id="cMsg" placeholder={cfg?.message?.placeholder || "Let us know how we can help you"} {...register("message", { required: "Message is required" })} />
        {err(errors.message?.message)}
      </div>
      <div>{bot.element}</div>
      <button className="pill pill--solid magnetic" type="submit" disabled={isLoading} style={{ height: 58 }}>
        {isLoading ? "Sending…" : cfg?.btnText || "Send Message"}
      </button>
    </form>
  );
}
