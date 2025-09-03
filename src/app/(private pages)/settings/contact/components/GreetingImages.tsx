import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IContactPage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  setValue: UseFormSetValue<IContactPage>;
  icons: {
    white: IContactPage["greetings"]["iconWhite"];
    black: IContactPage["greetings"]["iconBlack"];
  };
};

type TTarget = "iconWhite" | "iconBlack";

// variables
const ACTIVE_KEY = "OPEN_GREETING_LOGO_MODAL";

export default function GreetingImages({ setValue, icons }: Props) {
  //hooks
  const dispatch = useDispatch();
  const [blackLogo, setBlackLogo] = useState(icons?.white || "");
  const [whiteLogo, setWhiteLogo] = useState(icons?.black || "");
  const [target, setTarget] = useState<TTarget>("iconBlack");

  // handlers
  const handleSelect = (media: TMedia) => {
    if (target === "iconBlack") {
      setBlackLogo(media.secure_url);
    } else {
      setWhiteLogo(media.secure_url);
    }
    setValue(`greetings.${target}`, media.secure_url);
    dispatch(toggleModal(null));
  };

  const handleModalOpen = (val: TTarget) => {
    setTarget(val);
    dispatch(toggleModal(ACTIVE_KEY));
  };

  return (
    <>
      <button onClick={() => handleModalOpen("iconBlack")} type="button">
        <Image
          className="inline dark:hidden w-16"
          width={70}
          height={100}
          src={blackLogo || ""}
          alt="Star"
        />
      </button>
      <button onClick={() => handleModalOpen("iconWhite")} type="button">
        <Image
          className="hidden dark:inline w-16"
          width={70}
          height={100}
          src={whiteLogo || ""}
          alt="Star"
        />
      </button>


      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={ACTIVE_KEY}
        key={ACTIVE_KEY}
        cb={handleSelect}
      />
    </>
  );
}
