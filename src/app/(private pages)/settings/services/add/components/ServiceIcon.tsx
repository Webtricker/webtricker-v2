
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { TMedia } from "@/types/commonTypes";
import { GallerySingleIcon, PenSQRIcon } from "@/sharedComponets/ui/icons/Icons";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";

type Props = {
  setIcon: Dispatch<SetStateAction<string>>;
  icon: string;
};
export default function ServiceIcon({ setIcon, icon }: Props) {
  // hooks
  const dispatch = useDispatch();

  // handlers
  const handleClick = () => {
    dispatch(toggleModal("OPEN_MEDIA_SERVICE_ICON_MODAL"));
  };

  const handleSelect = (data: TMedia) => {
    dispatch(toggleModal(null));
    setIcon(data.secure_url);
  };

  return (
    <>
      <p className="wt_fs-md mb-1 block">Service Icon</p>
      <div className="w-[100px] h-[100px]  group relative flex items-center justify-center rounded-[4px] mb-5 lg:mb-10">
        {icon ? (
          <>
            <Image
              src={icon}
              alt="Post Thumnail"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-[10px]"
            />
            <button
              onClick={handleClick}
              className="duration-300 absolute top-[50%] translate-y-[-50%] left-[110px] bg-black p-2 text-white rounded-full w-10 h-10 flex items-center justify-center"
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
            <GallerySingleIcon className="w-20 lg:w-[100px] h-20 lg:h-[100px]" />
          </button>
        )}
      </div>
      <MediaModal 
      allowedMediaTypeToShow={['img']}
        activeKey="OPEN_MEDIA_SERVICE_ICON_MODAL"
        key={"OPEN_MEDIA_SERVICE_ICON_MODAL"}
        cb={handleSelect}
      />
    </>
  );
}
