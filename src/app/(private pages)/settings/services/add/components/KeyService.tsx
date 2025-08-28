import { PlusIcon, XMarkIcon } from "@/sharedComponets/ui/icons/Icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  setKeyServices: Dispatch<SetStateAction<string[]>>;
  keyServices: string[];
};

export default function KeyService({ setKeyServices, keyServices }: Props) {
  const [inputVal, setInputVal] = useState("");
  //   const handleSelect = (data: TMedia) => {
  //     dispatch(toggleModal(null));
  //     setThumnail(data);
  //   };

  // handlers
  const handleAdd = () => {
    const trimmedInput = inputVal.trim();
    // check for duplicate tag.
    if (!trimmedInput || keyServices.includes(trimmedInput)) {
      toast.error("Tag already exists");
      return;
    }

    // warn if user enters only special characters.
    if (!/[a-zA-Z0-9]/.test(trimmedInput)) {
      toast.error("Tag must contain at least one letter or number");
      return;
    }

    setKeyServices((prev) => [...prev, trimmedInput]);
    setInputVal("");
  };

  return (
    <div className="w-full mb-5 lg:mb-10">
      <div className="w-full mb-1">
        <label className="wt_fs-md block font-semibold">Sub services:</label>
        <ul className="font-semibold list-disc list-inside ml-5 flex flex-col gap-1 flex-wrap mt-2">
          {keyServices.map((subService, _i) => (
            <li className="relative group" key={_i}>
              <span className="">
                {subService}
                {_i !== keyServices?.length - 1 ? "," : ""}
              </span>

              <button
                title="Remove Sub Service"
                onClick={() =>
                  setKeyServices((prev) => prev.filter((item) => item !== subService))
                }
                className="duration-200 opacity-0 ml-5 group-hover:opacity-100"
              >
                <XMarkIcon className="duration-300 w-7 h-7 hover:text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      {keyServices?.length < 9 && (
        <div className="w-full flex items-center gap-4 group mt-4">
          <input
            className="wt_fs-md w-full px-4 py-2.5 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px]"
            placeholder="Enter a sub service"
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
