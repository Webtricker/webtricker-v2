import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import ParallaxImage from "@/sharedComponets/ui/parallaxImage/ParallaxImage";
import { TMedia } from "@/types/commonTypes";
import { IAboutPage } from "@/types/pageTypes";
import React from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

const defaultImg = "/images/about-us/mosharraf-speaking.webp";
type Props = {
  setValue: UseFormSetValue<IAboutPage>;
  data: IAboutPage;
};

export default function AboutUsThumnail({ setValue, data }: Props) {
  const KEY = "OPEN_ABOUT_US_BG_MODAL";

  //hooks
  const dispatch = useDispatch();
  const [img, setImg] = React.useState(data?.aboutUsImage || defaultImg);

  // handlers
  const handleSelect = (selectedMedia: TMedia) => {
    setImg(selectedMedia.secure_url);
    setValue("aboutUsImage", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };

  return (
    <>
      <button
        onClick={() => dispatch(toggleModal(KEY))}
        className="w-full lg:max-w-[600px] h-auto"
      >
        <ParallaxImage
          src={img}
          containerStyle="!rounded-[10px]"
          imgStyle="!rounded-[10px] !object-cover"
        />
      </button>
      {/* ===== media modal ===== */}
      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={KEY}
        key={KEY}
        cb={handleSelect}
      />
    </>
  );
}
