"use client";
import { CustomModal, CustomModalHeader } from "../modal/Modal";
import { useState } from "react";
import { GalleryIcon, VideoIcon } from "../icons/Icons";
import MediaImages from "./MediaImages";
import { TMedia } from "@/types/commonTypes";
import MediaVideos from "./MediaVideos";

type Props = {
  cb: (data: TMedia) => void;
  activeKey: string;
  allowedMediaTypeToShow?: Array<'img' | 'video'>;
};

export default function MediaModal({ cb, activeKey,allowedMediaTypeToShow=['img','video'] }: Props) {
  // hooks
  const [activeTab, setActiveTab] = useState<"img" | "video">(allowedMediaTypeToShow[0]);
  return (
    <CustomModal
      containerStyle="!max-w-[1200px] min-h-[400px] !bg-slate-300"
      activeKey={activeKey}
      key={activeKey}
    >
      <CustomModalHeader
        containerStyle="!bg-transparent border-b border-slate-400 !rounded-none"
        title="Choose Media"
      />
      <div className="w-full flex grow">
        <div className="w-full flex flex-col max-w-14 border-r border-slate-400 py-5 pr-4">
          {allowedMediaTypeToShow.includes("img") && (
            <button type="button" onClick={() => setActiveTab("img")} className="mb-5">
              <GalleryIcon
                className={`w-10 h-10 ${
                  activeTab === "img" ? "text-blue-600" : "hover:text-black"
                }`}
              />
            </button>
          )}
          {allowedMediaTypeToShow.includes("video") && (
            <button type="button" onClick={() => setActiveTab("video")}>
              <VideoIcon
                className={`w-10 h-10 ${
                  activeTab === "video" ? "text-blue-600" : "hover:text-black"
                }`}
              />
            </button>
          )}
        </div>
        <div className="w-full p-4 pr-0 max-h-[60vh]">
          {activeTab === "img" ? (
            <>
              <MediaImages cb={cb} />
            </>
          ) : (
            <>
              <MediaVideos cb={cb} />
            </>
          )}
        </div>
        {/* <button onClick={handleClick}>select</button> */}
      </div>
    </CustomModal>
  );
}
