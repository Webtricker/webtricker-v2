"use client";
import { EditPenIcon } from "@/app/(private pages)/components/Icons";
import { useUpdateSiteLogoMutation } from "@/redux/features/logos/logosApiSlice";
import { updateDarkLargeLogo } from "@/redux/features/logos/siteLogoSlice";
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
  "https://res.cloudinary.com/dirjayri8/raw/upload/v1748532597/r2rg0cgdr3xa8e8bctbw.svg";

export default function LargeLogoDark() {
  const dispatch = useDispatch();
  const { isLoading, isError, darkLargeLogo, defaultLogos } = useSelector(
    (state: RootState) => state.siteLogo
  );
  const [updateLogo, { isLoading: isUpdating }] = useUpdateSiteLogoMutation();
  const [newImage, setNewImage] = useState<string | null>(null);

  // handlers
  const handleEditClick = () => {
    dispatch(toggleModal("OPEN_DARK_LARGE_LOGO_MODAL"));
  };

  const handleImgSelect = (data: TMedia) => {
    setNewImage(data.secure_url);
    dispatch(toggleModal(null));
  };

  const handleSelectDefault = async () => {
    if (!defaultLogos?.darkLargeLogo) return;
    try {
      const res = await updateLogo({
        darkLargeLogo: defaultLogos?.darkLargeLogo,
      }).unwrap();

      if (res.success && res?.data?.darkLargeLogo) {
        dispatch(updateDarkLargeLogo(res.data.darkLargeLogo));
      }
    } catch (error) {
      toast.error("Error reseting");
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await updateLogo({
        darkLargeLogo: newImage,
      }).unwrap();
      if (res.success && res?.data?.darkLargeLogo) {
        setNewImage(null);
        dispatch(updateDarkLargeLogo(res.data.darkLargeLogo));
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
      <div className="w-full max-w-[300px] relative">
        <Image
          src={newImage || darkLargeLogo || fallbackUrl}
          width={200}
          height={100}
          className="bg-white border border-slate-500 rounded-[10px] z-10 p-2 md:p-5 md:px-10 md:w-[300px] h-auto object-cover"
          alt="Site logo large"
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
              className={`!py-2 !px-4`}
              label="Cancel"
              cb={() => setNewImage(null)}
            />
            {!!isUpdating ? (
              <LoadingSpinner className="w-8 h-8" />
            ) : (
              <Button
                className="!py-2 !px-4"
                label="Update"
                cb={handleUpdate}
              />
            )}
          </>
        )}

        {!!defaultLogos?.darkLargeLogo &&
          defaultLogos.darkLargeLogo !== darkLargeLogo && (
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
        activeKey="OPEN_DARK_LARGE_LOGO_MODAL"
        key={"OPEN_DARK_LARGE_LOGO_MODAL"}
        cb={handleImgSelect}
      />
    </>
  );
}
