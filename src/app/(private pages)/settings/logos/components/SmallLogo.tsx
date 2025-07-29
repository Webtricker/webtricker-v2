"use client";

import { EditPenIcon } from "@/app/(private pages)/components/Icons";
import { useUpdateSiteLogoMutation } from "@/redux/features/logos/logosApiSlice";
import { updateSmallLogo } from "@/redux/features/logos/siteLogoSlice";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { RootState } from "@/redux/store";
import Button from "@/sharedComponets/ui/buttons/Button";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TMedia } from "@/types/commonTypes";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const fallbackUrl =
  "https://res.cloudinary.com/dirjayri8/image/upload/v1748526122/zfmkx1ssrfbtsiibeeze.png";

export default function SmallLogo() {
  const dispatch = useDispatch();
  const { isLoading, isError, smallLogo, defaultLogos } = useSelector(
    (state: RootState) => state.siteLogo
  );
  const [updateLogo, { isLoading: isUpdating }] = useUpdateSiteLogoMutation();
  const [newImage, setNewImage] = useState<string | null>(null);

  const handleEditClick = () => {
    dispatch(toggleModal("OPEN_SMALL_LOGO_MODAL"));
  };

  const handleImgSelect = (data: TMedia) => {
    setNewImage(data.secure_url);
    dispatch(toggleModal(null));
  };

  const handleSelectDefault = async () => {
    if (!defaultLogos?.smallLogo) return;
    try {
      const res = await updateLogo({
        smallLogo: defaultLogos.smallLogo,
      }).unwrap();

      if (res.success && res?.data?.smallLogo) {
        dispatch(updateSmallLogo(res.data.smallLogo));
      }
    } catch (error) {
      toast.error("Error resetting");
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await updateLogo({
        smallLogo: newImage,
      }).unwrap();
      if (res.success && res?.data?.smallLogo) {
        setNewImage(null);
        dispatch(updateSmallLogo(res.data.smallLogo));
      }
    } catch (error) {
      toast.error("Failed to update logo");
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[300px] flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  if (isError) return <p className="text-red-400">Error loading image</p>;

  return (
    <>
      <div className="w-full max-w-[150px] relative">
        <Image
          src={newImage || smallLogo || fallbackUrl}
          width={100}
          height={80}
          className="border border-slate-500 rounded-[10px] z-10 p-2 md:p-5 md:px-10 md:w-auto max-w-[150px] h-auto object-cover"
          alt="Site logo small"
        />

        <button
          disabled={isUpdating}
          onClick={handleEditClick}
          className="absolute top-[50%] right-0 translate-x-[50%] translate-y-[-50%] bg-white dark:bg-black dark:text-white p-1.5 border rounded-full z-20"
        >
          <EditPenIcon />
        </button>
      </div>

      <div className="w-full items-start gap-5 flex flex-wrap">
        {!!newImage && (
          <>
            <Button
              disabled={isUpdating}
              className="!py-2 !px-4"
              label="Cancel"
              cb={() => setNewImage(null)}
            />
            {!!isUpdating ? (
              <LoadingSpinner className="w-8 h-8" />
            ) : (
              <Button className="!py-2 !px-4" label="Update" cb={handleUpdate} />
            )}
          </>
        )}

        {!!defaultLogos?.smallLogo &&
          defaultLogos.smallLogo !== smallLogo && (
            <Button
              disabled={isUpdating}
              className="!py-2 !px-4"
              label="Default"
              cb={handleSelectDefault}
            />
          )}
      </div>

      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey="OPEN_SMALL_LOGO_MODAL"
        key={"OPEN_SMALL_LOGO_MODAL"}
        cb={handleImgSelect}
      />
    </>
  );
}
