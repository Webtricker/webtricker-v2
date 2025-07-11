import { TMedia } from "@/types/commonTypes";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import Image from "next/image";
import { GallerySingleIcon, PlusIcon, TrashCanIcon } from "../icons/Icons";
import NoMediaFound from "./NoMediaFound";
import { useLazyGetMediaQuery } from "@/redux/features/media/MediaApiSlice";


type ImageUploaderBtnProps = {
  setMediaData:Dispatch<React.SetStateAction<TMedia[]>>
}
const ImageUploaderBtn = ({setMediaData}:ImageUploaderBtnProps) => {
  // hooks
  const inputRef = useRef<HTMLInputElement>(null);

  // handlers
  const triggerFileDialog = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // upload the file in the database.
    // setMediaData
    const fileArray = Array.from(files);
    const urls = fileArray.map((file) => URL.createObjectURL(file));


    e.target.value = "";
  };
  return (
    <>
      <div className="relative w-full border border-slate-400 rounded-[10px] h-[200px] flex flex-col items-center justify-center">
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          multiple={true}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <button className="flex flex-col items-center justify-center">
          <div onClick={triggerFileDialog} className="relative">
            <GallerySingleIcon className="w-10 h-10" />
            <PlusIcon className="w-7 h-7 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white" />
          </div>
          <p className="mt-1">Add file&apos;s</p>
        </button>
      </div>
    </>
  );
};

type Props = {
  cb: (data: TMedia) => void;
};
export default function MediaImages({ cb }: Props) {
  // hooks
  const [mediaData, setMediaData] = useState<TMedia[]>([]);
  const [loadMedia, { isLoading, error,  }, ] = useLazyGetMediaQuery();

  // effect
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await loadMedia({ type: "image" }).unwrap();
        if (res && res.success && res?.media?.length) {
          setMediaData(res.media);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [loadMedia]);

  if (error)
    return (
      <div className="w-full min-h-[200px] h-full flex items-center justify-center">
        <p>Error fetching media.</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="w-full min-h-[200px] h-full flex items-center justify-center">
        <LoadingSpinner className=" max-w-8" />
      </div>
    );

  if (!mediaData.length) return <NoMediaFound />;

  // handlers
  const removeImage = (public_id: string, resource_type: "image" | "video") => {
    //
    alert(`${public_id} : ${resource_type}`);
  };


  return (
    <div className="grow overflow-y-auto pr-4 max-h-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <ImageUploaderBtn setMediaData={setMediaData} />
      {mediaData.map((img: TMedia) => (
        <div
          onClick={()=>cb(img)}
          className="w-full group relative rounded-[10px] overflow-hidden h-[200px]"
          key={img._id}
        >
          <Image
            className="w-full h-full object-cover"
            src={img.secure_url}
            width={200}
            height={200}
            alt={`Media ${img._id}`}
          />

          <button
            onClick={() => removeImage(img.public_id, img.resource_type)}
            className="duration-300 absolute opacity-0 group-hover:opacity-100 top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            title="Remove image"
          >
            <TrashCanIcon className="w-5 h-5 text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
