"use client";

import { makeSlug } from "@/utils/blog";
import { useEffect, useMemo, useState } from "react";
import { PencilIcon } from "./icons";

type SlugInputProps = {
  value: string;
  onChange: (value: string) => void;
  sourceValue: string;
  existingSlugs?: string[];
};

export default function SlugInput({
  value,
  onChange,
  sourceValue,
  existingSlugs = [],
}: SlugInputProps) {
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!manual) onChange(makeSlug(sourceValue));
  }, [manual, onChange, sourceValue]);

  const duplicate = useMemo(
    () => Boolean(value && existingSlugs.includes(value)),
    [existingSlugs, value]
  );

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium">Slug</label>
        <button
          type="button"
          onClick={() => setManual(true)}
          className="inline-flex items-center gap-1 text-xs text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <PencilIcon className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
      <input
        value={value}
        readOnly={!manual}
        onChange={(event) => onChange(makeSlug(event.target.value))}
        className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 read-only:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:read-only:bg-zinc-900"
      />
      {duplicate && (
        <p className="text-xs text-red-600 dark:text-red-400">
          This slug is already in use
        </p>
      )}
    </div>
  );
}
