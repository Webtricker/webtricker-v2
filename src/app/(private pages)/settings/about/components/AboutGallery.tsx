import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IAboutPage } from "@/types/pageTypes";
import Image from "next/image";
import React from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

// TODO: have to change this url
const defaultImageOne =
  "https://liko.foxthemes.me/wp-content/uploads/2024/06/about-1.jpg";
const defaultImageTwo =
  "https://liko.foxthemes.me/wp-content/uploads/2024/06/about-2.jpg";
const defaultImageThree =
  "https://liko.foxthemes.me/wp-content/uploads/2024/06/about-3.jpg";

type Props = {
  setValue: UseFormSetValue<IAboutPage>;
  data: IAboutPage;
};

export default function AboutGallery({ setValue, data }: Props) {
  // variables
  const ABOUT_PAGE_BANNER_ONE = "OPEN_ABOUT_PAGE_BANNER_IMAGE_ONE_CHANGE_MODAL";
  const ABOUT_PAGE_BANNER_TWO = "OPEN_ABOUT_PAGE_BANNER_IMAGE_TWO_CHANGE_MODAL";
  const ABOUT_PAGE_BANNER_THREE =
    "OPEN_ABOUT_PAGE_BANNER_IMAGE_THREE_CHANGE_MODAL";

  //hooks
  const dispatch = useDispatch();
  const [imageOne, setImageOne] = React.useState(
    data?.introImages?.large || defaultImageOne
  );
  const [imageTwo, setImageTwo] = React.useState(
    data?.introImages?.medium || defaultImageTwo
  );
  const [imageThree, setImageThree] = React.useState(
    data?.introImages?.small || defaultImageThree
  );

  // handlers
  const handleSelectimageOne = (selectedMedia: TMedia) => {
    setImageOne(selectedMedia.secure_url);
    setValue("introImages.large", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };
  const handleSelectimageTwo = (selectedMedia: TMedia) => {
    setImageTwo(selectedMedia?.secure_url);
    setValue("introImages.medium", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };
  const handleSelectimageThree = (selectedMedia: TMedia) => {
    setImageThree(selectedMedia?.secure_url);
    setValue("introImages.small", selectedMedia?.secure_url);
    dispatch(toggleModal(null));
  };

  return (
    <div className="w-full flex items-center flex-col md:flex-row gap-10 lg:gap-20 justify-between">
      <div className="w-full max-w-[600px] relative h-[350px] md:h-[400px] lg:h-[428px]">
        <button
          type="button"
          onClick={() => dispatch(toggleModal(ABOUT_PAGE_BANNER_ONE))}
          className="w-full h-[400px] md:h-[550px] xl:h-[690px] overflow-hidden absolute left-0 bottom-0"
        >
          <Image
            width={600}
            height={900}
            className="w-full h-[135%] absolute left-0 bottom-0"
            src={imageOne}
            alt="Gallery Image 1"
          />
        </button>

        {/* ===== media modal ===== */}
        <MediaModal
          allowedMediaTypeToShow={["img"]}
          activeKey={ABOUT_PAGE_BANNER_ONE}
          key={ABOUT_PAGE_BANNER_ONE}
          cb={handleSelectimageOne}
        />
      </div>
      <div className="w-full relative flex justify-center">
        <button
          type="button"
          onClick={() => dispatch(toggleModal(ABOUT_PAGE_BANNER_TWO))}
          className="w-full max-w-[638px] h-[400px] lg:h-[428px] relative"
        >
          <Image
            width={638}
            height={428}
            className="w-full h-full absolute top-0 left-0"
            src={imageTwo}
            alt="Gallery Image"
          />
        </button>

        {/* ===== media modal ===== */}
        <MediaModal
          allowedMediaTypeToShow={["img"]}
          activeKey={ABOUT_PAGE_BANNER_TWO}
          key={ABOUT_PAGE_BANNER_TWO}
          cb={handleSelectimageTwo}
        />

        <button
          type="button"
          onClick={() => {
            dispatch(toggleModal(ABOUT_PAGE_BANNER_THREE));
          }}
          title="Click to change"
          className="w-full absolute -bottom-[40%] lg:-bottom-[60%] right-0 max-w-[260px]  h-[250px] lg:h-[310px]"
        >
          <Image
            width={600}
            height={900}
            className="w-full h-full max-w-[230px]"
            src={imageThree}
            alt="Gallery Image 1"
          />
        </button>
        {/* ===== media modal ===== */}
        <MediaModal
          allowedMediaTypeToShow={["img"]}
          activeKey={ABOUT_PAGE_BANNER_THREE}
          key={ABOUT_PAGE_BANNER_THREE}
          cb={handleSelectimageThree}
        />
      </div>
    </div>
  );
}
