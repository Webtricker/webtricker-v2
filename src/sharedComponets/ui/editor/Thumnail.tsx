import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { GallerySingleIcon, PenSQRIcon } from "../icons/Icons";
import MediaModal from "./MediaModal";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { TMedia } from "@/types/commonTypes";

type Props = {
  setThumnail: Dispatch<SetStateAction<TMedia | null>>;
  thumnail: TMedia | null;
};
export default function Thumnail({ setThumnail, thumnail }: Props) {
  // hooks
  const dispatch = useDispatch();

  // handlers
  const handleClick = () => {
    dispatch(toggleModal("OPEN_MEDIA_MODAL"));
  };

  const handleSelect = (data: TMedia) => {

    console.log(data, " data from select");
    // dispatch(toggleModal(null));
    // setThumnail(data);
  };

  return (
    <>
      <label className="wt_fs-md mb-1 block">Thumnail</label>
      <div className="w-full group relative flex items-center justify-center border border-slate-200 rounded-[10px] mb-5 lg:mb-10">
        {thumnail ? (
          <>
            <Image
              src={thumnail?.secure_url}
              alt="Post Thumnail"
              width={thumnail.width}
              height={thumnail.height}
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
            title="Add thumnail"
          >
            <GallerySingleIcon className="w-20 lg:w-28 h-20 lg:h-28" />
          </button>
        )}
      </div>
      <MediaModal 
      allowedMediaTypeToShow={['video']}
        activeKey="OPEN_MEDIA_MODAL"
        key={"OPEN_MEDIA_MODAL_WRAPPER"}
        cb={handleSelect}
      />
    </>
  );
}
