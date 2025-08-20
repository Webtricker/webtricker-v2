"use client";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IHomePage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

const dImage =
  "http://liko.foxthemes.me/wp-content/uploads/2024/06/hero-1-1.png";
const dVideo =
  "http://liko.foxthemes.me/wp-content/uploads/2024/06/hero-1-1.png";

const initialData = {
  src: dImage,
  type: "image",
};

type Props = {
  setValue: UseFormSetValue<IHomePage>;
  data: IHomePage;
};
export default function BannerRoundVideo({ setValue, data }: Props) {
  const KEY = "OPEN_BANNER_VIDEO_MODAL";

  //hooks
  const dispatch = useDispatch();
  const [bannerData, setBannerData] = useState(
    data?.bannerVideo || { type: "image", src: dImage }
  );

  useEffect(() => {
    setValue("bannerVideo", data?.bannerVideo || initialData);
  }, [data?.bannerVideo, setValue]);

  // handlers
  const handleSelect = (selectedMedia: TMedia) => {
    const selectedData = {
      src: selectedMedia.secure_url,
      type: selectedMedia.resource_type,
    };
    setBannerData(selectedData);
    setValue("bannerVideo", selectedData);
    dispatch(toggleModal(null));
  };

  return (
    <>
      <button onClick={() => dispatch(toggleModal(KEY))} type="button">
        <Image
          width={270}
          height={160}
          decoding="async"
          className={`hidden ${
            bannerData?.type === "image" && "md:block"
          } sm:w-[120px] rounded-full sm:h-[80px] md:w-[160px] md:h-[100px] lg:w-[220px] lg:h-[120px] 2xl:w-[270px] 2xl:h-[160px]`}
          src={bannerData?.src || dImage}
          alt=""
        />
        <video
          muted
          autoPlay
          className={`hidden ${
            bannerData?.type === "video" && "md:block"
          } sm:w-[120px] rounded-full sm:h-[80px] md:w-[160px] md:h-[100px] lg:w-[220px] lg:h-[120px] 2xl:w-[270px] 2xl:h-[160px]`}
          src={bannerData?.src || dVideo}
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
