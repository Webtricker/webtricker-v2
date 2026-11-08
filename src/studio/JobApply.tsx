"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSubmitContactFormMutation } from "@/redux/features/contact/contactApiSlice";
import PhoneField, { joinPhone } from "./PhoneField";
import { useBotCheck } from "@/sharedComponets/ui/security/useBotCheck";

type FormData = { name: string; email: string; phoneCode: string; phone: string; link: string; note: string };

/** "Apply Now" button + modal form. Goes through the same contact API, captcha and rate limit as the contact form. */
export default function JobApply({ title, applyTo }: { title: string; applyTo?: string }) {
  const [open, setOpen] = useState(false);
  const [submitForm, { isLoading }] = useSubmitContactFormMutation();
  const bot = useBotCheck();
  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormData>({ defaultValues: { phoneCode: "+880" } });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const onSubmit = handleSubmit(async (d) => {
    if (!bot.isAnswered) return void toast.error("Please answer the security question.");
    const message = [
      `JOB APPLICATION: ${title}`,
      joinPhone(d.phoneCode, d.phone) ? `Phone: ${joinPhone(d.phoneCode, d.phone)}` : "",
      d.link ? `Portfolio / LinkedIn / CV link: ${d.link}` : "",
      "",
      d.note,
    ].filter((x, i) => x || i === 2).join("\n");
    try {
      const res = await submitForm({ name: d.name, email: d.email, phone: joinPhone(d.phoneCode, d.phone), message, ...bot.getPayload() }).unwrap();
      if (res.success) {
        toast.success("Application sent. We'll be in touch!");
        reset({ phoneCode: "+880" });
        setOpen(false);
      } else toast.error("Could not send your application. Please try again.");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not send your application. Please try again.");
    } finally {
      void bot.refresh();
    }
  });

  const err = (m?: string) => (m ? <p className="form__msg" style={{ color: "var(--amber)" }}>{m}</p> : null);

  return (
    <>
      <button className="pill pill--solid" type="button" style={{ width: "100%" }} onClick={() => setOpen(true)}>
        Apply Now
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div className="stu applymodal" role="dialog" aria-modal="true" aria-label={`Apply for ${title}`} onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
              <form className="applymodal__box" onSubmit={onSubmit} noValidate>
                <button type="button" className="applymodal__x" aria-label="Close" onClick={() => setOpen(false)}>×</button>
                <div className="mono mute">Apply · {title}</div>
                <div className="field">
                  <label htmlFor="aName">Full name</label>
                  <input id="aName" autoComplete="name" placeholder="Your name" {...register("name", { required: "Name is required" })} />
                  {err(errors.name?.message)}
                </div>
                <div className="field">
                  <label htmlFor="aEmail">Email</label>
                  <input id="aEmail" type="email" autoComplete="email" placeholder="email@example.com" {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email format" } })} />
                  {err(errors.email?.message)}
                </div>
                <PhoneField id="aPhone" label="Phone (optional)" code={register("phoneCode")} number={register("phone", { pattern: { value: /^[\d\s\-()]{6,18}$/, message: "Enter a valid phone number" } })} error={errors.phone?.message} />
                <div className="field">
                  <label htmlFor="aLink">CV / Portfolio / LinkedIn link</label>
                  <input id="aLink" placeholder="https://…" {...register("link", { required: "Please add a link to your CV or portfolio" })} />
                  {err(errors.link?.message)}
                </div>
                <div className="field">
                  <label htmlFor="aNote">Cover note</label>
                  <textarea id="aNote" placeholder="Tell us a little about yourself" {...register("note", { required: "Cover note is required" })} />
                  {err(errors.note?.message)}
                </div>
                <div>{bot.element}</div>
                <button className="pill pill--solid" type="submit" disabled={isLoading} style={{ height: 54 }}>
                  {isLoading ? "Sending…" : "Send Application"}
                </button>
              </form>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
