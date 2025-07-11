"use client";
import { CustomModal, CustomModalHeader } from "../modal/Modal";
import { useState } from "react";
import { GalleryIcon, VideoIcon } from "../icons/Icons";
import MediaImages from "./MediaImages";
import { TMedia } from "@/types/commonTypes";

type Props = {
  cb: (data: TMedia) => void;
  activeKey: string;
};

export default function MediaModal({ cb, activeKey }: Props) {
  // hooks
  const [activeTab, setActiveTab] = useState<"img" | "video">("img");
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
        <div className="w-full p-4 pr-0 max-h-[60vh]">
          {activeTab === "img" ? (
            <>
              <MediaImages cb={cb} />
            </>
          ) : (
            <>
              <p>Media videos</p>
            </>
          )}
        </div>
        {/* <button onClick={handleClick}>select</button> */}
      </div>
    </CustomModal>
  );
}
