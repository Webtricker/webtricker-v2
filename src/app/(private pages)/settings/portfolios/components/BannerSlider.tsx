import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IPortfolioPage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";
import type { Swiper as SwiperType } from "swiper";
import { ObjectId } from "bson";

// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { toast } from "react-toastify";

type TSliderEl = {
  _id: string;
  img: string;
  technology: string;
  name: string;
};

type Props = {
  setValue: UseFormSetValue<IPortfolioPage>;
  bannerSlider: IPortfolioPage["bannerSlider"];
};

export default function BannerSlider({ bannerSlider, setValue }: Props) {
  //hooks
  const [sliderElements, setSliderElements] = useState<TSliderEl[]>(
    (bannerSlider as TSliderEl[]) || []
  );
  const swiperRef = useRef<SwiperType | null>(null);

  //   handlers
  const handleAdd = () => {
    const newData: TSliderEl = {
      _id: new ObjectId().toHexString(),
      img: "",
      technology: "",
      name: "",
    };

    setSliderElements((prev) => [...prev, newData]); // append
  };

  // After adding, slide to the last one
  useEffect(() => {
    if (swiperRef.current && sliderElements.length > 0) {
      swiperRef.current.slideTo(sliderElements.length - 1);
    }
  }, [sliderElements.length]);

  return (
    <>
      {!!sliderElements?.length && (
        <Swiper
          modules={[Navigation, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper; // Save Swiper instance
          }}
          className="mySwiper max-w-[85vw] bg-slate-200 border border-slate-400 min-h-[600px] max-h-[70vh] z-10 md:max-h-[80vh] block w-full h-full"
          slidesPerView={1}
          autoplay={false}
          navigation={true}
          pagination={{ clickable: true }}
        >
          {sliderElements.map((el) => (
            <SwiperSlide key={el._id} className="bg-blue-200 h-full p-0">
              <SwiperSliderSlide
                slideId={el._id}
                setSliderElements={setSliderElements}
                setValue={setValue}
                el={el}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <section className="w-full min-h-[200px] flex items-center justify-center z-10">
        <Button label="Add Slide" cb={handleAdd} />
      </section>
    </>
  );
}

type SlideProps = {
  slideId: string;
  el: {
    img: string;
    technology: string;
    name: string;
  };
  setSliderElements: React.Dispatch<React.SetStateAction<TSliderEl[]>>;
  setValue: UseFormSetValue<IPortfolioPage>;
};

const SwiperSliderSlide = ({
  el,
  setValue,
  setSliderElements,
  slideId,
}: SlideProps) => {

  // variables
  const BG_MODAL_KEY = `OPEN_BG_CHANGE_MODAL_${slideId}`;

  // hooks
  const dispatch = useDispatch();
  const [tech, setTech] = useState(el.technology);
  const [portfolio, setPortfolio] = useState(el.name);
  const [bg, setBg] = useState(el.img);
  const [hasChange, setHasChange] = useState(false);

  // hanlders
  const handleSelect = (media: TMedia) => {
    setBg(media.secure_url);
    dispatch(toggleModal(null));
    if (!hasChange && tech && portfolio) {
      setHasChange(true);
    }
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete?")) return;

    setSliderElements((prev) => {
      const next = prev.filter((s) => s._id !== slideId);
      setValue("bannerSlider", next);
      return next;
    });

    toast.success("Slider deleted");
  };

  const handleSaveSlide = () => {
    setSliderElements((prev) => {
      console.log(prev, " prevous elements");
      const next = prev.map((s) => {
        if (s._id === slideId) {
          return { ...s, img: bg, technology: tech, name: portfolio };
        }
        return s;
      });

      setValue("bannerSlider", next);
      return next;
    });
    setHasChange(false);
    toast.success("Slide saved");
  };

  const hideSaveBtn =
    el.img === bg && el.technology === tech && el.name === portfolio;

  return (
    <>
      <div className="w-full overflow-hidden h-full min-h-[600px] relative flex flex-col items-center justify-center">
        {!!bg && (
          <Image
            width={1900}
            height={800}
            className="w-full h-full object-cover z-0 absolute top-0 left-0"
            src={bg}
            alt="Product 1"
          />
        )}
        <button
          type="button"
          onClick={handleDelete}
          className="w-auto inline-flex z-30 mx-auto !absolute top-2 left-2 bg-white p-2 rounded-full"
        >
          <TrashCanIcon className="w-6 h-6 text-red-500" />
        </button>
        <div className="w-full h-full absolute top-0 left-0 bg-slate-900/30 flex z-20 flex-col items-center justify-center">
          <div className="w-auto inline-flex flex-col gap-5 p-5 rounded-[5px] text-white">
            <p className="text-center">
              Please add technology, portfolio and select background and then
              save slide
            </p>
            <p>
              <input
                onChange={(e) => {
                  if (!hasChange && bg && portfolio) {
                    setHasChange(true);
                  }
                  setTech(e.target.value);
                }}
                id="projectIntroduction.companyName"
                className="page-input !border-slate-50 text-center py-2 px-1 w-full"
                placeholder="Technology Name"
                value={tech}
              />
            </p>
            <h2 className="w-full">
              <textarea
                onChange={(e) => {
                  if (!hasChange && tech && bg) {
                    setHasChange(true);
                  }
                  setPortfolio(e.target.value);
                }}
                id="projectIntroduction.companyName"
                className="page-input text-center !border-slate-50 min-h-[140px] max-h-[160px] px-1 w-full"
                placeholder="Portfolio Name"
                value={portfolio}
              />
            </h2>

            <div className="w-full flex items-center justify-between">
              <Button
                className="max-w-[200px] mx-auto"
                label="Change BG"
                cb={() => dispatch(toggleModal(BG_MODAL_KEY))}
              />

              {!hideSaveBtn && hasChange && (
                <Button
                  className="max-w-[200px] mx-auto"
                  label="Save Slide"
                  cb={handleSaveSlide}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ===== media modal ===== */}
      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={BG_MODAL_KEY}
        key={BG_MODAL_KEY}
        cb={handleSelect}
      />
    </>
  );
};
