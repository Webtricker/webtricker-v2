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
        setMail('')
        setOtp('')
        toast.success(res.message);
        dispatch(toggleModal(null));
      }
    } catch (error: any) {
      console.log(error);
      console.log(`Error: ${error?.message} `);
      setErr(error?.data?.message || "Couldn't subscribe, try again");
    }
  };
  return (
    <CustomModal
      hideClickingOutside={false}
      containerStyle="!max-w-[500px] !rounded-[10px] md:!rounded-[15px]"
      activeKey={ACTIVE_KEY}
    >
      <CustomModalHeader
        containerStyle="!rounded-[8px] font-semibold"
        title="Email varification"
      />
      <div className="w-full flex flex-col items-center gap-5 py-5">
        <p className="text-center wt_fs-lg mb-5">Enter OTP from {mail}</p>
        <input
          type="text"
          className="border max-w-[200px] text-center rounded-[8px] duration-300 border-slate-400 focus:border-slate-600 dark:border-slate-700 py-2 wt_fs-lg  2xl:px-3.5 outline-none focus:outline-none"
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
              <LoadingSpinner />
            </button>
          ) : (
            <Button
              className="!py-2.5 wt_fs-md"
              label="Verify"
              cb={handleSubmit}
            />
          )}
        </div>
      </div>
    </CustomModal>
  );
}
