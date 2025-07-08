"use client";
import { useDispatch} from "react-redux";
import { CustomModal, CustomModalHeader } from "../modal/Modal";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { TMediaCB } from "@/types/commonTypes";
import { useState } from "react";
import { GalleryIcon, VideoIcon } from "../icons/Icons";
import MediaImages from "./MediaImages";

type Props = {
  cb: (data: TMediaCB) => void;
  activeKey: string;
};

export default function MediaModal({ cb, activeKey }: Props) {
  // hooks
  const [activeTab, setActiveTab] = useState<"img" | "video">("img");

  // handlers
  const dispatch = useDispatch();
  const handleClick = () => {
    const data: TMediaCB = {
      title: "Site Logo",
      type: "img",
      url: "https://res.cloudinary.com/dirjayri8/raw/upload/v1748532597/r2rg0cgdr3xa8e8bctbw.svg",
    };
    cb(data);
    dispatch(toggleModal(null));
  };

  return (
    <CustomModal
      containerStyle="!max-w-[1200px] min-h-[400px]"
      activeKey={activeKey}
      key={activeKey}
    >
      <CustomModalHeader
        containerStyle="!bg-transparent border-b border-slate-400 !rounded-none"
        title="Choose Media"
      />
      <div className="w-full flex grow">
        <div className="w-full flex flex-col max-w-14 border-r border-slate-400 py-5 pr-4">
          <button onClick={() => setActiveTab("img")} className="mb-5">
            <GalleryIcon
              className={`w-10 h-10 ${
                activeTab === "img" ? "text-blue-600" : "hover:text-black"
              }`}
            />
          </button>
          <button onClick={() => setActiveTab("video")} className="">
            <VideoIcon
              className={`w-10 h-10 ${
                activeTab === "video" ? "text-blue-600" : "hover:text-black"
              }`}
            />
          </button>
        </div>
        <div
          className="w-full p-4 pr-0 max-h-[60vh]"
        >
          <div className="grow overflow-y-auto pr-4 max-h-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {activeTab === "img" ? (
            <>
              <MediaImages cb={() => {}} />
            </>
          ) : (
            <>
              <p>Media videos</p>
            </>
          )}
           
          </div>
        </div>
        {/* <button onClick={handleClick}>select</button> */}
      </div>
    </CustomModal>
  );
}
