"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { isValidEmail } from "@/utils/auth";
import { useAddSubscriberMutation } from "@/redux/features/subscriber/subscribeApiSlice";
import NewsLetterVerifyForm from "@/sharedComponets/ui/footer/NewsLetterVerifyForm";
import { useBotCheck } from "@/sharedComponets/ui/security/useBotCheck";

const ACTIVE_KEY = "OPEN_SUBSCRIBE_VERIFICATION_MODAL";

/** Newsletter form in the Studio footer. Same API, captcha and OTP-verify flow as the live site. */
export default function StudioSubscribe() {
  const dispatch = useDispatch();
  const [mail, setMail] = useState("");
  const [addSubscriber, { isLoading }] = useAddSubscriberMutation();
  const bot = useBotCheck({ autoLoad: false });
  const [botLoaded, setBotLoaded] = useState(false);

  const loadBotCheck = () => {
    if (botLoaded) return;
    setBotLoaded(true);
    void bot.refresh();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mail) return;
    if (!isValidEmail(mail)) {
      toast.error("Please enter valid email");
      return;
    }
    if (!bot.isAnswered) {
      loadBotCheck();
      toast.error("Please answer the security question.");
      return;
    }
    try {
      const res = await addSubscriber({ email: mail, ...bot.getPayload() }).unwrap();
      if (!res.success) {
        toast.error(res?.message || "Something went wrong");
        setMail("");
      } else {
        toast.success(res.message);
        dispatch(toggleModal(ACTIVE_KEY));
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't subscribe, try again");
    } finally {
      void bot.refresh();
    }
  };

  return (
    <>
      <form className="sub" id="subForm" onSubmit={submit} noValidate>
        <label className="sr" htmlFor="subEmail">
          Email
        </label>
        <input
          id="subEmail"
          type="email"
          placeholder="Enter your email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          onFocus={loadBotCheck}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "…" : "Subscribe"}
        </button>
      </form>
      {botLoaded ? <div className="sub__msg">{bot.element}</div> : <div className="sub__msg" role="status" />}
      <NewsLetterVerifyForm setMail={setMail} mail={mail} />
    </>
  );
}
