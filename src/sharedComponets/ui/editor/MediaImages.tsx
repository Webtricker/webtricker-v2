import { useGetMediaQuery } from "@/redux/features/media/MediaApiSlice";
import { TMediaCB } from "@/types/commonTypes";
import React, { useRef, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import { demoMedia } from "@/data/media";
import Image from "next/image";
import { GallerySingleIcon, PlusIcon, XMarkIcon } from "../icons/Icons";

const ImageUploaderBtn = () => {
  // hooks
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // handlers

  const triggerFileDialog = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    e.target.value = ""; // reset for same file reselect
  };

  const removeImage = (index: number) => {
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]); // cleanup
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <>
      <div className="relative w-full border border-slate-400 rounded-[10px] h-full max-h-[200px] flex flex-col items-center justify-center">
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
          <p className="mt-1">Or Drag a file</p>
        </button>
      </div>
      {previews.map((url, i) => (
        <div key={i} className="relative group border rounded overflow-hidden">
          <Image
            width={200}
            height={200}
            src={url}
            alt={`preview-${i}`}
            className="w-full h-full object-cover rounded"
          />
          <button
            onClick={() => removeImage(i)}
            className="absolute top-1 right-1 bg-white rounded-full w-7 h-7 flex items-center justify-center"
            title="Remove image"
          >
            <XMarkIcon className="w-6 h-6 text-black" />
          </button>
        </div>
      ))}
    </>
  );
};

type Props = {
  cb: (data: TMediaCB) => void;
};
export default function MediaImages({ cb }: Props) {
  const { data, error, isLoading } = useGetMediaQuery({});

  // if (error)
  //   return (
  //     <div className="w-full h-full flex items-center justify-center">
  //       <p>Error fetching media.</p>
  //     </div>
  //   );
  // if (isLoading)
  //   return (
  //     <div className="w-full h-full flex items-center justify-center">
  //       <LoadingSpinner className=" max-w-8" />
  //     </div>
  //   );
  console.log(data, " data from fetching media");
  return (
    <>
      <ImageUploaderBtn />
      {demoMedia
        .filter((item) => item.type === "image")
        .map((img) => (
          <button
            className="w-full rounded-[10px] overflow-hidden max-h-[200px] h-full"
            key={img._id}
          >
            <Image
              className="w-full h-full object-cover"
              src={img.url}
              width={200}
              height={200}
              alt={`Media ${img._id}`}
            />
          </button>
        ))}
      {demoMedia
        .filter((item) => item.type === "image")
        .map((img) => (
          <button
            className="w-full rounded-[10px] overflow-hidden max-h-[200px] h-full"
            key={img._id}
          >
            <Image
              className="w-full h-full object-cover"
              src={img.url}
              width={200}
              height={200}
              alt={`Media ${img._id}`}
            />
          </button>
        ))}
      {demoMedia
        .filter((item) => item.type === "image")
        .map((img) => (
          <button
            className="w-full rounded-[10px] overflow-hidden max-h-[200px] h-full"
            key={img._id}
          >
            <Image
              className="w-full h-full object-cover"
              src={img.url}
              width={200}
              height={200}
              alt={`Media ${img._id}`}
            />
          </button>
        ))}
      {demoMedia
        .filter((item) => item.type === "image")
        .map((img) => (
          <button
            className="w-full rounded-[10px] overflow-hidden max-h-[200px] h-full"
            key={img._id}
          >
            <Image
              className="w-full h-full object-cover"
              src={img.url}
              width={200}
              height={200}
              alt={`Media ${img._id}`}
            />
          </button>
        ))}
      {demoMedia
        .filter((item) => item.type === "image")
        .map((img) => (
          <button
            className="w-full rounded-[10px] overflow-hidden max-h-[200px] h-full"
            key={img._id}
          >
            <Image
              className="w-full h-full object-cover"
              src={img.url}
              width={200}
              height={200}
              alt={`Media ${img._id}`}
            />
          </button>
        ))}
      {demoMedia
        .filter((item) => item.type === "image")
        .map((img) => (
          <button
            className="w-full rounded-[10px] overflow-hidden max-h-[200px] h-full"
            key={img._id}
          >
            <Image
              className="w-full h-full object-cover"
              src={img.url}
              width={200}
              height={200}
              alt={`Media ${img._id}`}
            />
          </button>
        ))}
    </>
  );
}
