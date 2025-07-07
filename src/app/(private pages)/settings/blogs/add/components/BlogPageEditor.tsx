"use client";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import Button from "@/sharedComponets/ui/buttons/Button";
import Description from "@/sharedComponets/ui/editor/Description";
// import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import Thumnail from "@/sharedComponets/ui/editor/Thumnail";
import TitleInput from "@/sharedComponets/ui/editor/TitleInput";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "tinymce";

export default function BlogPageEditor() {
  // ref
  const editorRef = useRef<Editor | null>(null);

  //   hook
  const [title, setTitle] = useState("some title");
  const [des, setDes] = useState("fdfsd");
  const [excerp, setExcerp] = useState("some excerpt");
  const [thumnail, setThumnail] = useState<string | null>("");

  const handleSave = () => {
    console.log(title);
    if (editorRef.current) {
      console.log(
        editorRef.current.getContent(),
        " content from Blog page editor"
      );
    }

    // console.log(editorRef.current);
    toast.success("btn clicked");
  };
  return (
    <>
      <div className="w-full lg:fixed z-50 top-0 py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
        <PageTitle key="ADD_BLOG" title="Add Blog" />
        <div className="w-auto hidden lg:block">
            <Button className="!py-2.5" label="Save" cb={handleSave} />
        </div>
      </div>
      <div className="w-full grow lg:pt-20 max-w-[952px] mx-auto">
        <TitleInput title={title} setTitle={setTitle} />
      <Thumnail thumnail={thumnail} setThumnail={setThumnail} />
      <Description des={des} excerp={excerp} setExcerp={setExcerp} setDes={setDes} />
      {/* <EditorContainer editorRef={editorRef} /> */}
      <div className="w-auto lg:hidden mt-6 md:mt-8">
            <Button className="!py-2.5" label="Save" cb={handleSave} />
        </div>
      </div>
    </>
  );
}
