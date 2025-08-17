import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { GallerySingleIcon, PenSQRIcon } from "../icons/Icons";
import MediaModal from "./MediaModal";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { TMedia } from "@/types/commonTypes";

type Props = {
  setCoverImage: Dispatch<SetStateAction<TMedia | null>>;
  coverImage: TMedia | null;
  label?: string;
};
export default function CoverImage({
  setCoverImage,
  coverImage,
  label = "Cover Image",
}: Props) {
  // hooks
  const dispatch = useDispatch();

  // handlers
  const handleClick = () => {
    dispatch(toggleModal("OPEN_COVER_IMAGE_MEDIA_MODAL"));
  };

  const handleSelect = (data: TMedia) => {
    dispatch(toggleModal(null));
    setCoverImage(data);
  };

  return (
    <>
      <p className="wt_fs-md mb-1 block">{label}</p>
      <div className="w-full group relative flex items-center justify-center border border-slate-400 rounded-[10px] mb-5 lg:mb-10">
        {coverImage ? (
          <>
            <Image
              src={coverImage?.secure_url}
              alt="coverImage"
              width={coverImage.width}
              height={coverImage.height}
              className="w-full h-full object-cover rounded-[10px]"
            />
            <button
              onClick={handleClick}
              className="duration-300 absolute opacity-0 group-hover:opacity-100 top-2 right-2 bg-black p-2 text-white rounded-full w-10 h-10 flex items-center justify-center"
              title="Change image"
            >
              <PenSQRIcon />
            </button>
          </>
        ) : (
          <button
            data-prevent-body-trigger
            onClick={handleClick}
            className="min-h-[250px]"
            title="Add Cover Image"
          >
            <GallerySingleIcon className="w-20 lg:w-28 h-20 lg:h-28" />
          </button>
        )}
      </div>
      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey="OPEN_COVER_IMAGE_MEDIA_MODAL"
        key={"OPEN_COVER_IMAGE_MEDIA_MODAL_WRAPPER"}
        cb={handleSelect}
      />
    </>
  );
}
