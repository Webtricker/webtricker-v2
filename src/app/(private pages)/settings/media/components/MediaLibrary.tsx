"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { makeSlug } from "@/utils/blog";
import { SearchIcon, TrashIcon, XIcon } from "@/dashboard/icons";
import { Button, Skeleton } from "@/dashboard/ui";

// ---- inline icons not yet in icons.tsx ----
type IconProps = { className?: string };
const SvgIcon = ({
  className = "h-4 w-4",
  children,
}: IconProps & { children: React.ReactNode }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const UploadIcon = (p: IconProps) => (
  <SvgIcon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </SvgIcon>
);

const CopyIcon = (p: IconProps) => (
  <SvgIcon {...p}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </SvgIcon>
);

const VideoIcon = (p: IconProps) => (
  <SvgIcon {...p}>
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </SvgIcon>
);

const ImagePlaceholderIcon = (p: IconProps) => (
  <SvgIcon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8.5" cy="10.5" r="1.5" />
    <path d="m21 15-5-5L5 19" />
  </SvgIcon>
);

// ---- types ----
type MediaItem = {
  _id: string;
  secure_url: string;
  resource_type: "image" | "video";
  public_id: string;
  format: string;
  width: number;
  height: number;
  size: number;
  duration?: number;
};

// ---- helpers ----
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFilename(publicId: string, format: string): string {
  const base = publicId.split("/").pop() || publicId;
  return format ? `${base}.${format}` : base;
}

function toPublicIdSuggestion(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  return makeSlug(withoutExt.replace(/_/g, "-"));
}

// ---- ConfirmDialog ----
function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  deleting,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Delete file?
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Permanently delete this file? Any page or post that references this
          URL will show a broken image.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- NamingDialog ----
function NamingDialog({
  files,
  names,
  onChangeName,
  onCancel,
  onConfirm,
  uploading,
}: {
  files: File[];
  names: string[];
  onChangeName: (index: number, value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  uploading: boolean;
}) {
  const allNamed = names.every((n) => n.trim().length > 0);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-100 p-5 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            Name your files
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            These names become the Cloudinary public_id and appear in the URL.
            Edit before uploading.
          </p>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-5">
          <div className="grid gap-4">
            {files.map((file, i) => (
              <div key={i} className="grid gap-1.5">
                <label className="text-xs text-zinc-500 dark:text-zinc-400">
                  {file.name}{" "}
                  <span className="text-zinc-400 dark:text-zinc-600">
                    ({formatBytes(file.size)})
                  </span>
                </label>
                <input
                  autoFocus={i === 0}
                  value={names[i] ?? ""}
                  onChange={(e) =>
                    onChangeName(i, makeSlug(e.target.value))
                  }
                  placeholder="my-file-name"
                  className="min-h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-100 p-5 dark:border-zinc-800">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={uploading || !allNamed}
          >
            {uploading
              ? "Uploading…"
              : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- MediaCard ----
function MediaCard({
  item,
  onCopy,
  onDelete,
}: {
  item: MediaItem;
  onCopy: (url: string) => void;
  onDelete: (item: MediaItem) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const filename = getFilename(item.public_id, item.format);
  const isImage = item.resource_type === "image";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900">
        {isImage && !imgError ? (
          <Image
            src={item.secure_url}
            alt={filename}
            fill
            unoptimized={item.format === "svg"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-contain p-1"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {isImage ? (
              <ImagePlaceholderIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
            ) : (
              <VideoIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
            )}
          </div>
        )}
      </div>

      <div className="p-2">
        <p
          className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200"
          title={filename}
        >
          {filename}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          {formatBytes(item.size)}
          {isImage && item.width
            ? ` · ${item.width}×${item.height}`
            : item.duration
              ? ` · ${item.duration.toFixed(1)}s`
              : ""}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-white/90 px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-950/90">
        <button
          type="button"
          onClick={() => onCopy(item.secure_url)}
          title="Copy URL"
          className="grid h-7 w-7 place-items-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <CopyIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          title="Delete"
          className="grid h-7 w-7 place-items-center rounded-md text-zinc-600 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ---- main component ----
export default function MediaLibrary() {
  const [tab, setTab] = useState<"image" | "video">("image");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Naming dialog state
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [pendingNames, setPendingNames] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async (type: "image" | "video") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?type=${type}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to load media");
      setItems(data.media || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load media");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSearch("");
    fetchMedia(tab);
  }, [tab, fetchMedia]);

  // Stage files for naming — called by drop zone and file input
  const stageFiles = (files: File[]) => {
    if (!files.length) return;
    const allowed = tab === "image" ? "image/" : "video/";
    const valid = files.filter((f) => f.type.startsWith(allowed));
    if (!valid.length) {
      toast.error(
        `Only ${tab === "image" ? "image" : "video"} files are allowed on this tab`
      );
      return;
    }
    if (valid.length < files.length) {
      toast.error(
        `${files.length - valid.length} file(s) skipped — wrong type for this tab`
      );
    }
    const batch = valid.slice(0, 10);
    setPendingFiles(batch);
    setPendingNames(batch.map((f) => toPublicIdSuggestion(f.name)));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cancelPending = () => {
    setPendingFiles(null);
    setPendingNames([]);
  };

  const updatePendingName = (index: number, value: string) => {
    setPendingNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Actual upload — fires after user confirms names
  const doUpload = async () => {
    if (!pendingFiles) return;
    const formData = new FormData();
    pendingFiles.forEach((f, i) => {
      formData.append("files", f);
      const finalName = makeSlug(pendingNames[i] ?? "");
      if (finalName) formData.append("names", finalName);
    });
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Upload failed");
      const uploaded: MediaItem[] = data.uploadedFiles || [];
      setItems((prev) => [...uploaded, ...prev]);
      toast.success(
        `${uploaded.length} file${uploaded.length !== 1 ? "s" : ""} uploaded`
      );
      setPendingFiles(null);
      setPendingNames([]);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("URL copied to clipboard"))
      .catch(() => toast.error("Failed to copy URL"));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: deleteTarget.public_id,
          resource_type: deleteTarget.resource_type,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Delete failed");
      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      toast.success("File deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = search.trim()
    ? items.filter((item) =>
        item.public_id.toLowerCase().includes(search.trim().toLowerCase())
      )
    : items;

  const tabBtn = (active: boolean) =>
    `px-4 py-1.5 text-sm font-medium rounded-md transition ${
      active
        ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
        : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
    }`;

  const accept = tab === "image" ? "image/*" : "video/*";

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Media Library
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Upload, browse, and manage your media files.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 whitespace-nowrap"
        >
          <UploadIcon className="h-4 w-4" />
          Upload
        </Button>
      </div>

      {/* Tabs + Search row */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            className={tabBtn(tab === "image")}
            onClick={() => setTab("image")}
          >
            Images
          </button>
          <button
            type="button"
            className={tabBtn(tab === "video")}
            onClick={() => setTab("video")}
          >
            Videos
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename…"
            className="min-h-11 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-9 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label="Clear search"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Upload drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          stageFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-5 grid cursor-pointer place-items-center rounded-lg border-2 border-dashed py-8 text-center transition ${
          dragging
            ? "border-[#4F46E5] bg-indigo-50 dark:bg-indigo-500/10"
            : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) =>
            e.target.files && stageFiles(Array.from(e.target.files))
          }
        />
        <UploadIcon
          className={`mb-2 h-6 w-6 ${
            dragging ? "text-[#4F46E5]" : "text-zinc-400"
          }`}
        />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {`Drop ${tab === "image" ? "images" : "videos"} here or click to browse`}
        </p>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Up to 10 files at once · you&apos;ll name each file before uploading
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
            >
              <Skeleton className="aspect-square" />
              <div className="p-2">
                <Skeleton className="mb-1.5 h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-600">
          {search ? (
            <>
              <SearchIcon className="mb-3 h-10 w-10" />
              <p className="text-sm">
                No files match &ldquo;{search}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-2 text-sm text-[#4F46E5] hover:underline"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              {tab === "image" ? (
                <ImagePlaceholderIcon className="mb-3 h-10 w-10" />
              ) : (
                <VideoIcon className="mb-3 h-10 w-10" />
              )}
              <p className="text-sm">
                No {tab === "image" ? "images" : "videos"} uploaded yet
              </p>
              <p className="mt-1 text-xs">
                Drop files above or click Upload to get started
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((item) => (
            <MediaCard
              key={item._id}
              item={item}
              onCopy={handleCopy}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Count line */}
      {!loading && items.length > 0 && (
        <p className="mt-4 text-right text-xs text-zinc-400 dark:text-zinc-600">
          {filtered.length === items.length
            ? `${items.length} file${items.length !== 1 ? "s" : ""}`
            : `${filtered.length} of ${items.length} files`}
        </p>
      )}

      {/* Naming dialog — shown when files are staged for upload */}
      {pendingFiles && (
        <NamingDialog
          files={pendingFiles}
          names={pendingNames}
          onChangeName={updatePendingName}
          onCancel={cancelPending}
          onConfirm={doUpload}
          uploading={uploading}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />
    </div>
  );
}
