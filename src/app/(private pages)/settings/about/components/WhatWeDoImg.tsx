import { useTheme } from "@/provider/ThemeProvider";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IAboutPage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  setValue: UseFormSetValue<IAboutPage>;
  data: IAboutPage;
};

export default function WhatWeDoImg({ setValue, data }: Props) {
  const { theme } = useTheme();
  const active_key = "WHAT_WE_DO_CURVE_ICON_MODAL";
  const [whiteIcon, setWhiteIcon] = useState(
    data?.whatWeOfferCurveIconWhite || ""
  );
  const [darkIcon, setDarkIcon] = useState(
    data?.whatWeOfferCurveIconBlack || ""
  );

  //hooks
  const dispatch = useDispatch();

  // handlers
  const handleSelect = (selectedMedia: TMedia) => {
    // set image based on the dark and white theme.
    if (theme === "dark") {
      setDarkIcon(selectedMedia.secure_url);
      setValue("whatWeOfferCurveIconBlack", selectedMedia.secure_url);
    } else {
      setWhiteIcon(selectedMedia.secure_url);
      setValue("whatWeOfferCurveIconWhite", selectedMedia.secure_url);
    }
    dispatch(toggleModal(null));
  };

  return (
    <>
      <button
       type="button"
       title="click to open modal"
        onClick={() => dispatch(toggleModal(active_key))}
        className="min-h-[96px] min-w-[65px] border border-red-400 w-full mt-4"
      >
        <Image
          className="w-16 md:w-16 h-auto inline-block  dark:hidden"
          src={whiteIcon}
          width={70}
          height={100}
          alt="Line svg"
        />
        <Image
          className="w-16 md:w-16 h-auto hidden dark:inline-block"
          src={darkIcon}
          width={70}
          height={100}
          alt="Line svg"
        />
      </button>

      {/* ===== media modal ===== */}
      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={active_key}
        key={active_key}
        cb={handleSelect}
      />
    </>
  );
}
