"use client";
import { TMedia } from "@/types/commonTypes";
import Image from "next/image";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { GallerySingleIcon, PenSQRIcon } from "../icons/Icons";
import MediaModal from "../editor/MediaModal";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";

type Props = {
  profile: string | null;
  setProfile: Dispatch<SetStateAction<string>>;
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  activeKey: string;
  children: ReactNode;
  className?: string;
  imgContainerStyle?: string;
  imgStyle?: string;
  facebookLink: string;
  setFaceebookLink: Dispatch<SetStateAction<string>>;
  instagramLink: string;
  setInstagramLink: Dispatch<SetStateAction<string>>;
  linkedInLink: string;
  setLinkedInLink: Dispatch<SetStateAction<string>>;
};

export default function LeaderForm({
  activeKey,
  children,
  name,
  profile,
  role,
  setName,
  setProfile,
  setRole,
  facebookLink,
  instagramLink,
  linkedInLink,
  setFaceebookLink,
  setInstagramLink,
  setLinkedInLink,
  className = "max-w-[500px]",
  imgContainerStyle = "lg:min-w-[450px] min-h-[400px]",
  imgStyle = "h-[400px]",
}: Props) {
  // hooks
  const dispatch = useDispatch();

  // handlers
  const handleSelect = (data: TMedia) => {
    setProfile(data.secure_url);
    dispatch(toggleModal(null));
  };

  return (
    <>
      <div
        className={`w-full p-5 lg:p-6 rounded-[10px] shadow-xl ${className}`}
      >
        <div className={`w-full ${imgContainerStyle}`}>
          <label htmlFor="" className="mb-1 block wt_fs-md">
            Profile
          </label>
          <div
            className={`w-full  group relative flex items-center justify-center border border-slate-300 rounded-[10px] mb-5 ${imgContainerStyle}`}
          >
            {profile ? (
              <>
                <Image
                  src={profile}
                  alt="Post Thumnail"
                  width={450}
                  height={400}
                  className={` w-full object-cover rounded-[10px] ${imgStyle}`}
                />
                <button
                  onClick={() => dispatch(toggleModal(activeKey))}
                  className="duration-300 absolute opacity-0 group-hover:opacity-100 top-2 right-2 bg-black p-2 text-white rounded-full w-10 h-10 flex items-center justify-center"
                  title="Change image"
                >
                  <PenSQRIcon />
                </button>
              </>
            ) : (
              <button
                data-prevent-body-trigger
                onClick={() => dispatch(toggleModal(activeKey))}
                className="min-h-[250px]"
                title="Add thumnail"
              >
                <GallerySingleIcon className="w-20 lg:w-28 h-20 lg:h-28" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full">
          <div className="w-full">
            <label htmlFor="name" className="mb-1 block wt_fs-md">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              placeholder="Enter name"
              className="wt_fs-md px-4 py-2.5 lg:py-3 border outline-none border-slate-300 hover:border-slate-500 rounded-[10px] w-full"
            />
          </div>
          <div className="w-full mt-5">
            <label htmlFor="role" className="mb-1 block wt_fs-md">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              id="role"
              name="role"
              placeholder="Enter role"
              className="wt_fs-md px-4 py-2.5 lg:py-3 border outline-none border-slate-300 hover:border-slate-500 rounded-[10px] w-full"
            />
          </div>
          <div className="w-full mt-5">
            <label htmlFor="role" className="mb-1 block wt_fs-md">
              FacebookLink
            </label>
            <input
              type="text"
              value={facebookLink}
              onChange={(e) => setFaceebookLink(e.target.value)}
              id="facebookLink"
              name="facebookLink"
              placeholder="Enter facebook link"
              className="wt_fs-md px-4 py-2.5 lg:py-3 border outline-none border-slate-300 hover:border-slate-500 rounded-[10px] w-full"
            />
          </div>
          <div className="w-full mt-5">
            <label htmlFor="role" className="mb-1 block wt_fs-md">
              Instagram Link
            </label>
            <input
              type="text"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              id="instagramLink"
              name="instagramLink"
              placeholder="Enter instagram link"
              className="wt_fs-md px-4 py-2.5 lg:py-3 border outline-none border-slate-300 hover:border-slate-500 rounded-[10px] w-full"
            />
          </div>
          <div className="w-full mt-5">
            <label htmlFor="role" className="mb-1 block wt_fs-md">
              LinkedIn Link
            </label>
            <input
              type="text"
              value={linkedInLink}
              onChange={(e) => setLinkedInLink(e.target.value)}
              id="linkedInLink"
              name="linkedInLink"
              placeholder="Enter linkedIn link"
              className="wt_fs-md px-4 py-2.5 lg:py-3 border outline-none border-slate-300 hover:border-slate-500 rounded-[10px] w-full"
            />
          </div>

          <div className="w-full mt-5 flex justify-center min-h-[44px]">
            {children}
          </div>
        </div>
      </div>
      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={activeKey}
        key={activeKey}
        cb={handleSelect}
      />
    </>
  );
}
