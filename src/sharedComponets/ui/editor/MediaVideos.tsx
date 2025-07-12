import { TMedia } from "@/types/commonTypes";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import { GallerySingleIcon, PlusIcon, TrashCanIcon } from "../icons/Icons";
import NoMediaFound from "./NoMediaFound";
import {
  useDeleteMediaMutation,
  useLazyGetMediaQuery,
  usePostMediaMutation,
} from "@/redux/features/media/MediaApiSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { IMedia } from "@/models/Media";

type VideoUploaderBtnProps = {
  setMediaData: Dispatch<React.SetStateAction<TMedia[]>>;
};
const VideoUploaderBtn = ({ setMediaData }: VideoUploaderBtnProps) => {
  // variables
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const UPLOAD_PRESET = "video_upload_preset";
  // hooks
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [postMediaToDB, { isLoading }] = usePostMediaMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  // handlers
  const triggerFileDialog = () => inputRef.current?.click();

  const handleUpload = async (file: File) => {
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            } else {
              // Fallback: show indeterminate loading or default value
              setProgress(0); // or keep it as-is
            }
          },
        }
      );

      // get the necessary data
      if (response?.data && response.data?.public_id) {
        const media: IMedia = {
          secure_url: response.data.secure_url,
          resource_type:
            response.data.resource_type === "video" ? "video" : "image",
          asset_id: response.data.asset_id,
          public_id: response.data.public_id,
          format: response.data.format,
          width: response.data.width,
          height: response.data.height,
          size: response.data.bytes,
          duration: response.data.duration,
        };

        // upload to the database
        const res = await postMediaToDB(media).unwrap();
        if (res.success) {
          setMediaData((prev) => [...prev, res.media]);
        } else {
          throw new Error("Upload to database failed");
        }
      } else {
        throw new Error("Upload failed");
      }
    } catch (err: any) {
      toast.error(err?.message || "Upload failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-full border border-slate-400 rounded-[10px] h-[200px] flex flex-col items-center justify-center">
        <input
          type="file"
          ref={inputRef}
          accept="video/*"
          multiple={false}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          style={{ display: "none" }}
        />

        {loading ? (
          <div>
            <p className="text-blue-600 font-medium">Uploading: {progress}%</p>
            <div className="w-full h-2 bg-gray-300 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : isLoading ? (
          <div className="w-full min-h-[200px] h-full flex items-center justify-center">
            <LoadingSpinner className=" max-w-8" />
          </div>
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

type TModalVideo = {
  cb: (data: TMedia) => void;
  setMediaData: Dispatch<React.SetStateAction<TMedia[]>>;
  video: TMedia;
};
const ModalVideo = ({ cb, setMediaData, video }: TModalVideo) => {
  const [deleteMedia, { isLoading }] = useDeleteMediaMutation();

  // handlers
  const removeVideo = async () => {
    try {
      const res = await deleteMedia({
        public_id: video.public_id,
        resource_type: video.resource_type,
      }).unwrap();
      if (res.success) {
        setMediaData((prev) =>
          prev.filter((item) => item.public_id !== video.public_id)
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
      onClick={() => cb(video)}
      className=" w-full group relative rounded-[10px] overflow-hidden h-[200px]"
      key={video._id}
    >
      <video
        src={video.secure_url}
        width={200}
        height={200}
        autoPlay
        controls
        muted
        className="w-full h-full object-cover"
      />
      <button
        data-prevent-body-trigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          removeVideo();
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
          key={video._id}
        >
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

// ========== load the videos and render =========
type Props = {
  cb: (data: TMedia) => void;
};
export default function MediaVideos({ cb }: Props) {
  // hooks
  const [mediaData, setMediaData] = useState<TMedia[]>([]);
  const [loadMedia, { isLoading, error }] = useLazyGetMediaQuery();

  // effect
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await loadMedia({ type: "video" }).unwrap();
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
      <VideoUploaderBtn setMediaData={setMediaData} />

      {!mediaData.length ? (
        <NoMediaFound type="Video" />
      ) : (
        mediaData.map((video: TMedia) => (
          <ModalVideo
            setMediaData={setMediaData}
            cb={cb}
            key={video.public_id}
            video={video}
          />
        ))
      )}
    </div>
  );
}
