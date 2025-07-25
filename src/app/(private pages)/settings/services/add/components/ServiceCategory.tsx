import React, { Dispatch, SetStateAction } from 'react'

type Props = {
  setSelectedCategory: Dispatch<SetStateAction<string>>;
   selectedCategory: string
};
export default function ServiceCategory({selectedCategory,setSelectedCategory}:Props) {
  return (
    <div className="w-full mb-5 lg:mb-10">
      <label className="wt_fs-md mb-1 block">Category : should be unique</label>
      <input
        className="wt_fs-md px-4 py-2.5 lg:py-3 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px] w-full "
        placeholder="Ex: Web Development | UX-UI Design | Digital Marketing"
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      />
    </div>
  )
}
