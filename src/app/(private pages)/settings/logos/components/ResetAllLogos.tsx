"use client";
import { useUpdateSiteLogoMutation } from "@/redux/features/logos/logosApiSlice";
import { setAllLogos } from "@/redux/features/logos/siteLogoSlice";
import { RootState } from "@/redux/store";
import Button from "@/sharedComponets/ui/buttons/Button";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ResetAllLogos() {
  const dispatch = useDispatch();
  const { isLoading, defaultLogos } = useSelector(
    (state: RootState) => state.siteLogo
  );
  const [updateLogo, { isLoading: isUpdating }] = useUpdateSiteLogoMutation();

  // handlers
  const handleReset = async () => {
    if (!defaultLogos?.smallLogo) return;
    try {
      const res = await updateLogo({
        smallLogo: defaultLogos?.smallLogo,
        darkLargeLogo: defaultLogos?.darkLargeLogo,
        lightLargeLogo: defaultLogos?.lightLargeLogo,
      }).unwrap();

      if (res.success && res?.data?.smallLogo) {
        dispatch(
          setAllLogos({
            ...defaultLogos,
            defaultLogos: defaultLogos,
          })
        );
      }
    } catch (error) {
      toast.error("Error reseting");
      console.log(error);
    }
  };

  const isProcessing = isLoading || isUpdating;
  return (
    <div className="w-full">
      {!isProcessing && <Button cb={handleReset} className="!py-2.5" label="RESET" />}
    </div>
  );
}
