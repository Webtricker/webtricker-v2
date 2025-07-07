import React, { Dispatch, SetStateAction } from "react";

type Props = {
  des: string;
  excerp?: string;
  setDes: Dispatch<SetStateAction<string>>;
  setExcerp: Dispatch<SetStateAction<string>>;
};

export default function Description({
  des,
  excerp,
  setDes,
  setExcerp,
}: Props) {
  return (
    <div className="w-full mb-5 lg:mb-10">
      <label className="wt_fs-md mb-1 block">Description</label>
      <textarea
        className="wt_fs-md min-h-[200px] px-4 py-2.5 lg:py-3 border outline-none border-slate-200 hover:border-slate-400 rounded-[10px] w-full "
        placeholder="Enter description"
        onChange={(e) => setDes(e.target.value)}
        value={des}
      />

      <label className="wt_fs-md mb-1 block mt-5">Excerpt</label>
      <textarea
        className="wt_fs-md min-h-[100px] px-4 py-2.5 lg:py-3 border outline-none border-slate-200 hover:border-slate-400 rounded-[10px] w-full "
        placeholder="Enter excerpt"
        onChange={(e) => setExcerp(e.target.value)}
        value={excerp}
      />
    </div>
  );
}
