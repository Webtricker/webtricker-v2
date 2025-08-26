import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IPortfolioPage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";

const images = [
  "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F1.jpg?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F2.jpg?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F3.jpg?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F4.jpg?alt=media",
  "https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F5.jpg?alt=media",
];

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

type Props = {
  setValue: UseFormSetValue<IPortfolioPage>;
};
export default function BannerSlider({ setValue }: Props) {
  const BANNER_BACKGROUND_MODAL_KEY =
    "OPEN_SERVICE_BANNER_BACKGROUND_CHANGE_MODAL";

  //hooks
  const dispatch = useDispatch();
  const [sliderElements, setSliderElements] = useState([
    { img: "", technology: "", name: "" },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);

  //   handlers
  const handleAdd = () => {
    const newData = {
      img: "",
      technology: "",
      name: "",
    };

    setSliderElements([newData, ...sliderElements]);
  };

  // image select cb
  const handleSelect = (selectedMedia: TMedia) => {
    const selectedEl = {
      src: selectedMedia.secure_url,
      type: selectedMedia.resource_type,
    };
    // setValue("bannerBG", selectedEl);
    dispatch(toggleModal(null));
  };

  return (
    <>
      {!!sliderElements?.length ? (
        <Swiper
          modules={[Navigation, Pagination]}
          onSwiper={(e) => console.log(e)}
          className="mySwiper max-h-[70vh] z-10 md:max-h-[80vh] block w-full h-full"
          slidesPerView={1}
          autoplay={false}
          navigation={true}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <div className="w-full min-h-full relative">
              <Image
                width={1900}
                height={800}
                className="w-full h-full"
                src="https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F1.jpg?alt=media"
                alt="Product 1"
              />
              <div className="w-full h-full bg-gray-200 absolute top-0 left-0 flex flex-col items-center justify-center">
                <div className="w-auto inline-flex flex-col gap-5 bg-red-50">
                  <h3>Product 1</h3>
                  <p>$19.99</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full min-h-full relative">
              <Image
                width={1900}
                height={800}
                className="w-full h-full"
                src="https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F1.jpg?alt=media"
                alt="Product 1"
              />
              <div className="w-full h-full bg-gray-200 absolute top-0 left-0 flex flex-col items-center justify-center">
                <div className="w-auto inline-flex flex-col gap-5 bg-red-50">
                  <h3>Product 2</h3>
                  <p>$19.99</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full min-h-full relative">
              <Image
                width={1900}
                height={800}
                className="w-full h-full"
                src="https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F1.jpg?alt=media"
                alt="Product 1"
              />
              <div className="w-full h-full bg-gray-200 absolute top-0 left-0 flex flex-col items-center justify-center">
                <div className="w-auto inline-flex flex-col gap-5 bg-red-50">
                  <h3>Product 3</h3>
                  <p>$19.99</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full min-h-full relative">
              <Image
                width={1900}
                height={800}
                className="w-full h-full"
                src="https://firebasestorage.googleapis.com/v0/b/infinitegallery-f9fac.appspot.com/o/image-reveal%2F1.jpg?alt=media"
                alt="Product 1"
              />
              <div className="w-full h-full bg-gray-200 absolute top-0 left-0 flex flex-col items-center justify-center">
                <div className="w-auto inline-flex flex-col gap-5 bg-red-50">
                  <h3>Product 4</h3>
                  <p>$19.99</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      ) : (
        <section className="w-full  max-h-[70vh] flex items-center justify-center z-10 md:max-h-[80vh] border border-slate-300 rounded-[3px] hover:border-slate-500 h-[70vh] bg-red-200">
          <Button label="Add Slider" cb={handleAdd} />
        </section>
      )}

      {/* ===== media modal ===== */}
      <MediaModal
        allowedMediaTypeToShow={["img", "video"]}
        activeKey={BANNER_BACKGROUND_MODAL_KEY}
        key={BANNER_BACKGROUND_MODAL_KEY}
        cb={handleSelect}
      />
    </>
  );
}
