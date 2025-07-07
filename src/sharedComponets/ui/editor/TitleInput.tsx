import { makeExcerpt } from '@/utils/blog';
import React, { Dispatch, SetStateAction } from 'react'


type Props = {
    title:string;
    setTitle:Dispatch<SetStateAction<string>>
}
export default function TitleInput({title,setTitle}:Props) {
  return (
    <div className='w-full mb-5 lg:mb-10'>
        <label className='wt_fs-md mb-1 block'>Title</label>
        <textarea value={title} className='wt_fs-md px-4 py-2.5 border outline-none border-slate-200 hover:border-slate-400 rounded-[10px] w-full ' placeholder='Enter title' onChange={(e)=>setTitle(e.target.value)} ></textarea>
        { !!title && <p className='mt-3'>Slug: &quot;/{makeExcerpt(title)}&quot;</p>}
    </div>
  )
}
