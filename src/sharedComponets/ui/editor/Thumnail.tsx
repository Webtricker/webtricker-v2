import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { GallerySingleIcon } from "../icons/Icons";
import { toast } from "react-toastify";
import MediaModal from "./MediaModal";
import { TMediaCB } from "@/types/commonTypes";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";

type Props = {
  setThumnail: Dispatch<SetStateAction<string | null>>;
  thumnail: string | null;
};
export default function Thumnail({ setThumnail, thumnail }: Props) {
  // hooks
  const dispatch = useDispatch();

  // handlers
  const handleClick = () => {
    dispatch(toggleModal("OPEN_MEDIA_MODAL"));
    // TODO:
    toast.warn("API integration in progress");
  };

  const handleSelect = (data: TMediaCB) => {
    console.log(data);
  };

  return (
    <>
      <label className="wt_fs-md mb-1 block">Thumnail</label>
      <div className="w-full flex items-center justify-center min-h-[500px] border border-slate-200 rounded-[10px] mb-5 lg:mb-10">
        {thumnail ? (
          <Image
            src={thumnail}
            alt="Post Thumnail"
            width={900}
            height={500}
            className="w-full h-full object-cover"
          />
        ) : (
          <button
            data-prevent-body-trigger
            onClick={handleClick}
            className=""
            title="Add thumnail"
          >
            <GallerySingleIcon className="w-20 lg:w-28 h-20 lg:h-28" />
          </button>
        )}
      </div>
      <MediaModal activeKey="OPEN_MEDIA_MODAL" key={'OPEN_MEDIA_MODAL_WRAPPER'} cb={handleSelect} />
    </>
  );
}
