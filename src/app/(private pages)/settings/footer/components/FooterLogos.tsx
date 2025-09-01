import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IFooter } from "@/types/componentsType";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

type Props = {
  logo: IFooter["logo"];
  setValue: UseFormSetValue<IFooter>;
};

type TTarget = "white" | "black";

// variables
const ACTIVE_KEY = "OPEN_FOOTER_LOGO_MODAL";

export default function FooterLogos({ logo, setValue }: Props) {
  //hooks
  const dispatch = useDispatch();
  const [black, setBlack] = useState(logo?.black || "");
  const [white, setWhite] = useState(logo?.white);
  const [target, setTarget] = useState<TTarget>("white");

  useEffect(() => {
    setValue("logo.white", logo?.white || "");
    setValue("logo.black", logo?.black || "");
  }, [logo, setValue]);

  // handlers
  const handleSelect = (media: TMedia) => {
    if (target === "white") {
      setWhite(media.secure_url);
    } else {
      setBlack(media.secure_url);
    }

    setValue(`logo.${target}`, media.secure_url);
    dispatch(toggleModal(null));
  };

  const handleModalOpen = (val: TTarget) => {
    setTarget(val);
    dispatch(toggleModal(ACTIVE_KEY));
  };

  return (
    <>
      <button onClick={() => handleModalOpen("black")} type="button">
        <Image
          className="inline dark:hidden w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
          width={282}
          height={74}
          src={black || ""}
          alt="Star"
        />
      </button>
      <button onClick={() => handleModalOpen("white")} type="button">
        <Image
          className="hidden dark:inline w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
          width={282}
          height={74}
          src={white || ""}
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
