import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IHomePage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  setValue: UseFormSetValue<IHomePage>;
  data: IHomePage;
};
export default function BannerSpinningIcon({ setValue, data }: Props) {
  const BLACK_LOGO_MODAL_ACTIVE_KEY = "OPEN_BANNER_SPINNING_BLACK_LOGO_MODAL";
  const WHITE_LOGO_MODAL_ACTIVE_KEY = "OPEN_BANNER_SPINNING_WHITE_LOGO_MODAL";

  //hooks
  const dispatch = useDispatch();
  const [blackLogo, setBlackLogo] = useState(data?.bannerSpinningIconBlack);
  const [whiteLogo, setWhiteLogo] = useState(data?.bannerSpinningIconWhite);

  // handlers
  const handleBlackLogoSelect = (selectedMedia: TMedia) => {
    setBlackLogo(selectedMedia.secure_url);
    setValue("bannerSpinningIconBlack", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };
  const handleWhiteLogoSelect = (selectedMedia: TMedia) => {
    setWhiteLogo(selectedMedia.secure_url);
    setValue("bannerSpinningIconWhite", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };
  return (
    <>
      <button
        onClick={() => dispatch(toggleModal(BLACK_LOGO_MODAL_ACTIVE_KEY))}
        type="button"
      >
        <Image
          className="inline dark:hidden banner-spinning-star w-5 md:w-6 lg:w-8 2xl:!w-10"
          width={40}
          height={40}
          src={blackLogo || "/images/home/hero-shape-1-1-black.webp"}
          alt="Star"
        />
      </button>
      <button
        onClick={() => dispatch(toggleModal(WHITE_LOGO_MODAL_ACTIVE_KEY))}
        type="button"
      >
        <Image
          className="hidden dark:inline banner-spinning-star w-5 md:w-6 lg:w-8 2xl:!w-10"
          width={40}
          height={40}
          src={whiteLogo || "/images/home/hero-shape-star-white.png"}
          alt="Star"
        />
      </button>

      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={BLACK_LOGO_MODAL_ACTIVE_KEY}
        key={BLACK_LOGO_MODAL_ACTIVE_KEY}
        cb={handleBlackLogoSelect}
      />
      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={WHITE_LOGO_MODAL_ACTIVE_KEY}
        key={WHITE_LOGO_MODAL_ACTIVE_KEY}
        cb={handleWhiteLogoSelect}
      />
    </>
  );
}
