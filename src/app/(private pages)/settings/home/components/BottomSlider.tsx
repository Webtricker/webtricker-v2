import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IHomePage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";
type Props = {
  setValue: UseFormSetValue<IHomePage>;
  data: IHomePage;
};

export default function BottomSlider({ setValue, data }: Props) {
  const KEY = "OPEN_HOME_BOTTOM_SLIDER_MODAL";
  useEffect(() => {
    setValue("bottomSlider", data?.bottomSlider || []);
  }, [data.bottomSlider, setValue]);
  //   hooks
  const dispatch = useDispatch();
  const [sliderImages, setSliderImages] = useState<string[]>(
    data?.bottomSlider || []
  );
  const [clickedUrl, setClickedUrl] = useState<string>("");

  // handlers
  const handleClick = (url: string) => {
    dispatch(toggleModal(KEY));
    setClickedUrl(url);
  };

  const handleSelect = (selectedMedia: TMedia) => {
    const newImages = sliderImages.map((url) => {
      if (url === clickedUrl) {
        return selectedMedia.secure_url;
      } else {
        return url;
      }
    });
    setSliderImages(newImages);
    setValue("bottomSlider", newImages);
    dispatch(toggleModal(null));
  };

  return (
    <section className="w-full py-8 px-5 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <h4 className="mb-4">Slide images</h4>
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {sliderImages.map((image, index) => (
          <div key={index} className="w-full">
            <button
              type="button"
              className="w-full h-full"
              onClick={() => handleClick(image)}
            >
              <Image
                src={image}
                alt="Slider images"
                width={323.6}
                height={200}
                className="h-[300px] md:h-[420px] w-full object-cover lg:h-[570px]"
              />
            </button>
          </div>
        ))}
      </div>

      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={KEY}
        key={KEY}
        cb={handleSelect}
      />
    </section>
  );
}
