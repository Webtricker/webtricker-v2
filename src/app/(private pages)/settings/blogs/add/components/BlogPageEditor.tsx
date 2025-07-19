"use client";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import { useAddPostsMutation } from "@/redux/features/post/postApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import Category from "@/sharedComponets/ui/editor/Category";
import Description from "@/sharedComponets/ui/editor/Description";
import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import Tag from "@/sharedComponets/ui/editor/Tag";
// import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import Thumnail from "@/sharedComponets/ui/editor/Thumnail";
import TitleInput from "@/sharedComponets/ui/editor/TitleInput";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TMedia } from "@/types/commonTypes";
import { TCategory } from "@/types/data";
import { TBlog } from "@/types/post";
import { makeSlug } from "@/utils/blog";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "tinymce";

export default function BlogPageEditor() {
  // ref
  const editorRef = useRef<Editor | null>(null);

  //   hook
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [excerp, setExcerp] = useState("");
  const [thumnail, setThumnail] = useState<TMedia | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [postBlog, { isLoading }] = useAddPostsMutation();

  const handleSave = async () => {

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!des.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!tags.length) {
      toast.error("Tags required");
      return;
    }

    if (!tags.length) {
      toast.error("Tags required");
      return;
    }

    if (!excerp.trim()) {
      toast.error("Excerp is required");
      return;
    }

    if (!thumnail) {
      toast.error("Thumnail is required");
      return;
    }

    const blogData: TBlog = {
      title,
      slug: `/${makeSlug(title)}`,
      description: des,
      excerp,
      thumnail: {
        width: thumnail?.width,
        height: thumnail?.height,
        url: thumnail?.secure_url,
      },
      tags,
      postType: "blog",
      categories: selectedCategories,
      content: "",
    };

    if (editorRef.current) {
      blogData.content = editorRef.current.getContent();
    }

    try {
      const res = await postBlog({ data: blogData }).unwrap();
      if (res.success) {
        toast.success("Post added");
        setTitle("");
        setDes("");
        setTags([]);
        setExcerp("");
        setThumnail(null);
        setSelectedCategories([]);

        editorRef.current?.setContent("");
      } else {
        toast.success(res?.message);
      }
    } catch (error: any) {
      console.log(error?.data?.message);
      toast.error(
        error?.data?.message || "Error occured adding post. Try again"
      );
    }
  };
  return (
    <>
      <div className=" w-full lg:fixed z-50 top-0 py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
        <PageTitle key="ADD_BLOG" title="Add Blog" />

        {isLoading ? (
          <div className="w-[110px] hidden lg:block">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-auto hidden lg:block">
            <Button className="!py-2.5" label="Save" cb={handleSave} />
          </div>
        )}
      </div>
      <div className="w-full relative grow lg:pt-20 max-w-[970px] mx-auto">
        <TitleInput title={title} setTitle={setTitle} />
        <Thumnail thumnail={thumnail} setThumnail={setThumnail} />
        <Description
          des={des}
          excerp={excerp}
          setExcerp={setExcerp}
          setDes={setDes}
        />

        <Tag tags={tags} setTags={setTags} />
        <Category
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <EditorContainer editorRef={editorRef} />
        
         {isLoading ? (
          <div className="w-[50px] lg:hidden mt-6 md:mt-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-auto lg:hidden mt-6 md:mt-8">
          <Button className="!py-2.5" label="Save" cb={handleSave} />
        </div>
        )}
      </div>
    </>
  );
}
