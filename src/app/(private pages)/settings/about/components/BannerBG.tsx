import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IAboutPage } from "@/types/pageTypes";
import React, { Dispatch, SetStateAction } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  setValue: UseFormSetValue<IAboutPage>;
  setBannerBG: Dispatch<SetStateAction<string>>;
};

export default function BannerBG({ setValue, setBannerBG }: Props) {
  const BANNER_BACKGROUND_MODAL_KEY = "OPEN_BANNER_BACKGROUND_CHANGE_MODAL";

  //hooks
  const dispatch = useDispatch();

  // handlers
  const handleSelect = (selectedMedia: TMedia) => {
    setBannerBG(selectedMedia.secure_url);
    setValue("bannerBackgroundImage", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };

  return (
    <>
      <div className="w-[200px]">
        <button
         type="button"
          onClick={() => dispatch(toggleModal(BANNER_BACKGROUND_MODAL_KEY))}
          className="wt_fs-xl border px-4 py-1 rounded-full"
        >
          Change BG
        </button>
      </div>

      {/* ===== media modal ===== */}
      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={BANNER_BACKGROUND_MODAL_KEY}
        key={BANNER_BACKGROUND_MODAL_KEY}
        cb={handleSelect}
      />
    </>
  );
}
