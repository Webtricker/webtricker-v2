"use client";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IHomePage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  setValue: UseFormSetValue<IHomePage>;
  data: IHomePage;
};
export default function IntroVideo({ setValue, data }: Props) {
  const KEY = "OPEN_HOME_INTRO_VIDEO_MODAL";

  //hooks
  const dispatch = useDispatch();
  const [introData, setIntroData] = useState(data?.introVideo);

  useEffect(() => {
    setValue("introVideo", data?.introVideo);
  }, [data?.introVideo, setValue]);

  // handlers
  const handleSelect = (selectedMedia: TMedia) => {
    const selectedData = {
      src: selectedMedia.secure_url,
      type: selectedMedia.resource_type,
    };
    setIntroData(selectedData);
    setValue("introVideo", selectedData);
    dispatch(toggleModal(null));
  };

  return (
    <>
      <button onClick={() => dispatch(toggleModal(KEY))} className="my-20 w-full overflow-hidden" type="button">
        <Image
          width={270}
          height={160}
          decoding="async"
          className={`${introData?.type === "image" ? "block " : 'hidden '} className="h-screen max-h-screen w-full object-cover"`}
          src={introData?.src || ""}
          alt=""
        />
        <video
          muted
          autoPlay
          loop={true}
          className={`${introData?.type === "video" ? "block " : 'hidden '} className="h-screen max-h-screen w-full object-cover"`}
          src={introData?.src}
        ></video>
      </button>

      <MediaModal
        allowedMediaTypeToShow={["img", "video"]}
        activeKey={KEY}
        key={KEY}
        cb={handleSelect}
      />
    </>
  );
}

