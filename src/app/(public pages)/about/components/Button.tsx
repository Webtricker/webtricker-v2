"use client";

import { ArrowDownIcon } from "./Icons";

export const ScrollToExploreBtn = ({text}:{text:string}) => {
  return (
    <div className="w-full flex justify-end px-5">
      <button className="flex items-start gap-5 text-white">
        <span className="">{text || ""}</span> <ArrowDownIcon className="animate-bounce duration-1000" />
      </button>
    </div>
  );
};
