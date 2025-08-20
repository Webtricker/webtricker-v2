import { TMedia } from "@/types/commonTypes";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import Image from "next/image";
import { GallerySingleIcon, PlusIcon, TrashCanIcon } from "../icons/Icons";
import NoMediaFound from "./NoMediaFound";
import {
  useDeleteMediaMutation,
  useLazyGetMediaQuery,
} from "@/redux/features/media/MediaApiSlice";
import { toast } from "react-toastify";
import { useUploadMutation } from "@/redux/features/upload/uploadApiSlice";

type ImageUploaderBtnProps = {
  setMediaData: Dispatch<React.SetStateAction<TMedia[]>>;
};
const ImageUploaderBtn = ({ setMediaData }: ImageUploaderBtnProps) => {
  // hooks
  const [uploadMedia, { isLoading }] = useUploadMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  // handlers
  const triggerFileDialog = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // upload the file in the database.
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    try {
      const res = await uploadMedia(formData).unwrap();
      if (
        res &&
        res.success &&
        res?.uploadedFiles &&
        res.uploadedFiles?.length
      ) {
        setMediaData((prev) => [...res.uploadedFiles,...prev]);
      } else {
        throw new Error("Error uploading files");
      }
    } catch (err) {
      toast.error("Error uploading file's");
      console.error("Upload failed:", err);
    }

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

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <button className="flex flex-col items-center justify-center">
            <div onClick={triggerFileDialog} className="relative">
              <GallerySingleIcon className="w-10 h-10" />
              <PlusIcon className="w-7 h-7 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-white" />
            </div>
            <p className="mt-1">Add file&apos;s</p>
          </button>
        )}
      </div>
    </>
  );
};

type TModalImage = {
  cb: (data: TMedia) => void;
  setMediaData: Dispatch<React.SetStateAction<TMedia[]>>;
  img: TMedia;
};
const ModalImage = ({ cb, setMediaData, img }: TModalImage) => {
  const [deleteMedia, { isLoading }] = useDeleteMediaMutation();

  // handlers
  const removeImage = async () => {
    try {
      const res = await deleteMedia({
        public_id: img.public_id,
        resource_type: img.resource_type,
      }).unwrap();
      if (res.success) {
        setMediaData((prev) =>
          prev.filter((item) => item.public_id !== img.public_id)
        );
      } else {
        throw new Error("Error deleting media");
      }
    } catch (error) {
      toast.error("Error deleting file's");
      console.log(error);
    }
  };
  return (
    <div
      onClick={() => cb(img)}
      className=" w-full group relative rounded-[10px] overflow-hidden h-[200px]"
      key={img._id}
    >
      <Image
        className="w-full h-full"
        src={img.secure_url}
        width={200}
        height={200}
        alt={`Media ${img._id}`}
      />

      <button
        data-prevent-body-trigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeImage();
        }}
        className="duration-300 absolute opacity-0 group-hover:opacity-100 top-2 right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
        title="Remove image"
      >
        <TrashCanIcon className="w-5 h-5 text-red-500" />
      </button>

      {/* ====== loading overlay ======= */}
      {!!isLoading && (
        <div
          className="absolute top-0 left-0 min-h-full w-full flex items-center backdrop-blur-lg text-white justify-center border rounded-[10px]h-full"
          key={img._id}
        >
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

// ========== load the images and render =========
type Props = {
  cb: (data: TMedia) => void;
};
export default function MediaImages({ cb }: Props) {
  // hooks
  const [mediaData, setMediaData] = useState<TMedia[]>([]);
  const [loadMedia, { isLoading, error }] = useLazyGetMediaQuery();
 
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

  return (
    <div className="grow overflow-y-auto pr-4 max-h-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <ImageUploaderBtn setMediaData={setMediaData} />
      {!mediaData.length ? (
        <NoMediaFound />
      ) : (
        mediaData.map((img: TMedia) => (
          <ModalImage
            setMediaData={setMediaData}
            cb={cb}
            key={img.public_id}
            img={img}
          />
        ))
      )}
    </div>
  );
}
