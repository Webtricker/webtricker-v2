import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IBlogPage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

type BannerBG = {
  type: "image" | "video";
  src: string;
};

type Props = {
  setValue: UseFormSetValue<IBlogPage>;
  bannerBG: BannerBG;
};
export default function BannerBackground({ setValue, bannerBG }: Props) {
  const BANNER_BACKGROUND_MODAL_KEY =
    "OPEN_BLOGS_BANNER_BACKGROUND_CHANGE_MODAL";

  //hooks
  const dispatch = useDispatch();
  const [bg, setBg] = useState<BannerBG>(bannerBG);
  // handlers
  const handleSelect = (selectedMedia: TMedia) => {
    const selectedEl = {
      src: selectedMedia.secure_url,
      type: selectedMedia.resource_type,
    };
    setBg(selectedEl);
    setValue("bannerBG", selectedEl);
    dispatch(toggleModal(null));
  };

  return (
    <>
      {!bg ? (
        <Button
          className="object-cover mx-10 absolute top-0 left-0 min-w-[150px] -z-10 whitespace-nowrap"
          data-prevent-body-trigger
          cb={() => dispatch(toggleModal(BANNER_BACKGROUND_MODAL_KEY))}
          label="Add BG"
        />
      ) : bg?.type === "image" ? (
        <Image
          title="Click to change background"
          width={1800}
          height={900}
          onClick={() => dispatch(toggleModal(BANNER_BACKGROUND_MODAL_KEY))}
          src={bg?.src || ""}
          className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Service Banner Image"
        />
      ) : (
        <video
          title="Click to change background"
          onClick={() => dispatch(toggleModal(BANNER_BACKGROUND_MODAL_KEY))}
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src={bg?.src || ""}
        >
          <source src={bg?.src || ""} type="video/mp4" />
        </video>
      )}

      {/* ===== media modal ===== */}
      <MediaModal
        allowedMediaTypeToShow={["img", "video"]}
        activeKey={BANNER_BACKGROUND_MODAL_KEY}
        key={BANNER_BACKGROUND_MODAL_KEY}
        cb={handleSelect}
      />
    </>
  );
}
