import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TMedia } from "@/types/commonTypes";
import { IHomePage } from "@/types/pageTypes";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";
type Props = {
  setValue: UseFormSetValue<IHomePage>;
  data: IHomePage;
};

export default function IntroVideo({ setValue, data }: Props) {
  const KEY = "OPEN_HOME_INTRO_VIDEO_MODAL";

  //hooks
  const dispatch = useDispatch();
  const [video, setVideo] = useState(data?.introVideo);

  useEffect(() => {
    setValue("introVideo", data?.introVideo || "");
  }, [data?.introVideo, setValue]);

  // handlers
  const handleSelect = (selectedMedia: TMedia) => {
    setVideo(selectedMedia.secure_url);
    setValue("introVideo", selectedMedia.secure_url);
    dispatch(toggleModal(null));
  };

  return (
    <>
      <button
        onClick={() => dispatch(toggleModal(KEY))}
        className="w-full my-20"
        title="Click to change video"
        type="button"
      >
        <video
          autoPlay
          muted
          loop
          preload="metadata"
          className="h-screen w-full object-cover"
          src={video}
        ></video>
      </button>

      <MediaModal
        allowedMediaTypeToShow={["video"]}
        activeKey={KEY}
        key={KEY}
        cb={handleSelect}
      />
    </>
  );
}
