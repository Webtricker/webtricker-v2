import React, { useState } from "react";
import { CustomModal, CustomModalHeader } from "../modal/Modal";
import { useDispatch } from "react-redux";
import { useVerfifySubscriberMutation } from "@/redux/features/subscriber/subscribeApiSlice";
import LoadingSpinner from "../loading/LoadingSpinner";
import Button from "../buttons/Button";
import { toast } from "react-toastify";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";

export default function NewsLetterVerifyForm({
  mail,
  setMail,
}: {
  mail: string;
  setMail: React.Dispatch<React.SetStateAction<string>>;
}) {
  const ACTIVE_KEY = "OPEN_SUBSCRIBE_VERIFICATION_MODAL";

  // hooks
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");

  const [verifySubscriber, { isLoading }] = useVerfifySubscriberMutation();

  // handlers
  const handleSubmit = async () => {
    if (!otp) return;

    if (otp.length < 6 || otp.length > 6) {
      setErr("OTP must be 6 charecters");
      return;
    }

    setErr("");

    // save the mail to the database
    try {
      const res = await verifySubscriber({ email: mail, otp }).unwrap();
      console.log(res, " res from verify suscriber");
      if (!res.success) {
        setErr(res?.message || "Something went wrong");
        setOtp("");
      } else {
        setMail("");
        setOtp("");
        toast.success(res.message);
        dispatch(toggleModal(null));
      }
    } catch (error: any) {
      console.log(error);
      console.log(`Error: ${error?.message} `);
      setErr(error?.data?.message || "Couldn't subscribe, try again");
    }
  };

  const handleClose = () => {
    setMail("");
    setOtp("");
    setErr("");
  };

  return (
    <CustomModal
      hideClickingOutside={false}
      containerStyle="border border-slate-200 dark:border-slate-600 dark:bg-black !max-w-[500px] !rounded-[10px] md:!rounded-[15px]"
      wrapperContainerStyle="dark:bg-slate-800/50 backdrop-blur-xs"
      activeKey={ACTIVE_KEY}
    >
      <CustomModalHeader
        handler={handleClose}
        containerStyle="!rounded-[8px] font-semibold dark:bg-slate-700 dark:text-white"
        titleStyle="dark:text-white"
        title="Email varification"
      />
      <div className="w-full flex flex-col items-center gap-5 py-5">
        <p className="text-center wt_fs-lg mb-5 dark:text-white">
          Enter OTP from {mail}
        </p>
        <input
          type="text"
          className="border dark:text-white max-w-[200px] text-center rounded-[8px] duration-300 border-slate-400 focus:border-slate-500 dark:border-slate-600 py-2 wt_fs-lg  2xl:px-3.5 outline-none focus:outline-none"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            setErr("");
            setOtp(e.target.value);
          }}
        />

        {!!err && <p className="text-center text-red-500">{err}</p>}

        <div className="w-full mt-5 flex justify-center">
          {isLoading ? (
            <button className="flex items-center justify-center min-w-[113px] min-h-10 lg:min-h-[44px]">
              <LoadingSpinner className="dark:text-white" />
            </button>
          ) : (
            <Button
              className="!py-2.5 wt_fs-md dark:!border-slate-300 dark:!text-white"
              label="Verify"
              cb={handleSubmit}
            />
          )}
        </div>
      </div>
    </CustomModal>
  );
}
