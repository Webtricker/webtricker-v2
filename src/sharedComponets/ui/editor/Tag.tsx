import React, { Dispatch, SetStateAction, useState } from "react";
import { PlusIcon, XMarkIcon } from "../icons/Icons";
import { toast } from "react-toastify";

type Props = {
  setTags: Dispatch<SetStateAction<string[]>>;
  tags: string[];
};
export default function Tag({ setTags, tags }: Props) {
  const [inputVal, setInputVal] = useState("");
  //   const handleSelect = (data: TMedia) => {
  //     dispatch(toggleModal(null));
  //     setThumnail(data);
  //   };

  // handlers
  const handleAdd = () => {
    const trimmedInput = inputVal.trim();
    // check for duplicate tag.
    if (!trimmedInput || tags.includes(trimmedInput)) {
      toast.error("Tag already exists");
      return;
    }

    // warn if user enters only special characters.
    if (!/[a-zA-Z0-9]/.test(trimmedInput)) {
      toast.error("Tag must contain at least one letter or number");
      return;
    }

    setTags((prev) => [...prev, trimmedInput]);
    setInputVal("");
  };

  return (
    <div className="w-full mb-5 lg:mb-10">
      <div className="w-full flex items-center gap-4 mb-1">
        <label className="wt_fs-md block">Tags:</label>
        <div className="font-semibold flex items-center gap-4 flex-wrap">
          {tags.map((tag, _i) => (
            <div className="relative group" key={_i}>
              <p className="wt_fs-md">
                {tag}
                {_i !== tags.length - 1 ? "," : ""}
              </p>

              <button
                title="Remove tag"
                onClick={() =>
                  setTags((prev) => prev.filter((item) => item !== tag))
                }
                className="absolute duration-200 p-2 opacity-0 group-hover:opacity-100 -top-5 -right-5"
              >
                <XMarkIcon className="duration-300 w-5 h-5 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {tags?.length < 9 && (
        <div className="w-full flex items-center gap-4 group mt-4">
          <input
            className="wt_fs-md w-auto px-4 py-2.5 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px]"
            placeholder="Enter a tag"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="flex p-2 rounded-full items-center justify-center duration bg-blue-400 hover:bg-blue-500"
          >
            <PlusIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
