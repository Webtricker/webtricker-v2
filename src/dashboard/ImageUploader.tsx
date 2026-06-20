"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { makeSlug } from "@/utils/blog";
import { ImageIcon, XIcon } from "./icons";
import { Button } from "./ui";

type ImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
  altText: string;
  onAltTextChange: (value: string) => void;
  titleText?: string;
  onTitleTextChange?: (value: string) => void;
};

function toPublicIdSuggestion(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  return makeSlug(withoutExt.replace(/_/g, "-"));
}

export default function ImageUploader({
  value,
  onChange,
  altText,
  onAltTextChange,
  titleText = "",
  onTitleTextChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingName, setPendingName] = useState("");

  const stagefile = (file?: File) => {
    if (!file) return;
    setPendingFile(file);
    setPendingName(toPublicIdSuggestion(file.name));
  };

  const cancelPending = () => {
    setPendingFile(null);
    setPendingName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;
    const formData = new FormData();
    formData.append("files", pendingFile);
    const finalName = makeSlug(pendingName);
    if (finalName) formData.append("names", finalName);
    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.uploadedFiles?.[0]) {
        throw new Error(data.message || "Upload failed");
      }
      onChange(data.uploadedFiles[0].secure_url);
      setPendingFile(null);
      setPendingName("");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-3">
      {/* Drop zone — hidden when a pending file is waiting for name review */}
      {!pendingFile && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            stagefile(event.dataTransfer.files?.[0]);
          }}
          className={`relative grid min-h-44 cursor-pointer place-items-center rounded-md border border-dashed p-4 text-center transition ${
            dragging
              ? "border-[#4F46E5] bg-indigo-50 dark:bg-indigo-500/10"
              : "border-zinc-300 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => stagefile(event.target.files?.[0])}
          />
          {value ? (
            <>
              <Image
                src={value}
                alt={altText || "Uploaded image"}
                width={420}
                height={260}
                className="max-h-64 w-full rounded-md object-cover"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange("");
                }}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-zinc-950 text-white"
                aria-label="Remove image"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="grid justify-items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <ImageIcon className="h-8 w-8" />
              <p>Drop an image here or click to browse</p>
            </div>
          )}
        </div>
      )}

      {/* Naming panel — shown after a file is selected, before upload */}
      {pendingFile && (
        <div className="grid gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Name this file
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {pendingFile.name}
            </p>
          </div>
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Filename (used as Cloudinary public_id)
            </label>
            <input
              autoFocus
              value={pendingName}
              onChange={(e) => setPendingName(makeSlug(e.target.value))}
              placeholder="my-image-name"
              className="min-h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={cancelPending}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmUpload}
              disabled={uploading || !pendingName.trim()}
            >
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <label className="text-sm font-medium">Alt text</label>
        <input
          required
          value={altText}
          onChange={(event) => onAltTextChange(event.target.value)}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Title</label>
        <input
          value={titleText}
          onChange={(event) => onTitleTextChange?.(event.target.value)}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
        />
      </div>
    </div>
  );
}
