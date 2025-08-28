import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IServicesPage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  setValue: UseFormSetValue<IServicesPage>;
  data: IServicesPage;
};

// variables
const BLACK_LOGO_MODAL_ACTIVE_KEY = "OPEN_BANNER_SPINNING_BLACK_LOGO_MODAL";
const WHITE_LOGO_MODAL_ACTIVE_KEY = "OPEN_BANNER_SPINNING_WHITE_LOGO_MODAL";


export default function ServiceIcon({ setValue, data }: Props) {

  //hooks
  const dispatch = useDispatch();
  const [blackLogo, setBlackLogo] = useState(data?.servicesShotcut?.iconBlack);
  const [whiteLogo, setWhiteLogo] = useState(data?.servicesShotcut?.iconBlack);

  useEffect(() => {
    setValue(
      "servicesShotcut.iconBlack",
      data?.servicesShotcut?.iconBlack || ""
    );
    setValue(
      "servicesShotcut.iconWhite",
      data?.servicesShotcut?.iconWhite || ""
    );
  }, [data?.servicesShotcut, setValue]);

  // handlers
  const handleBlackLogoSelect = (selectedMedia: TMedia) => {
    setBlackLogo(selectedMedia.secure_url);
    setValue("servicesShotcut.iconBlack", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };
  const handleWhiteLogoSelect = (selectedMedia: TMedia) => {
    setWhiteLogo(selectedMedia.secure_url);
    setValue("servicesShotcut.iconWhite", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };
  return (
    <>
      <button
        onClick={() => dispatch(toggleModal(BLACK_LOGO_MODAL_ACTIVE_KEY))}
        type="button"
      >
        <Image
          className="inline dark:hidden w-4"
          width={40}
          height={40}
          src={blackLogo || ""}
          alt="Star"
        />
      </button>
      <button
        onClick={() => dispatch(toggleModal(WHITE_LOGO_MODAL_ACTIVE_KEY))}
        type="button"
      >
        <Image
          className="hidden dark:inline w-4"
          width={10}
          height={10}
          src={whiteLogo || ""}
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
