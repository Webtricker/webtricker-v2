"use client";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  label: string;
};
export default function DynamicInput({
  value,
  setValue,
  placeholder,
  label,
}: Props) {
  return (
    <div className="w-full mb-5 lg:mb-10">
      <label className="wt_fs-md mb-1 block">{label}</label>
      <textarea
        value={value}
        className="wt_fs-md px-4 py-2.5 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px] w-full "
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
    </div>
  );
}
