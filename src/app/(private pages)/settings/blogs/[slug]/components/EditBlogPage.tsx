"use client";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import { useUpdatePostMutation } from "@/redux/features/post/postApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import Category from "@/sharedComponets/ui/editor/Category";
import Description from "@/sharedComponets/ui/editor/Description";
import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import Tag from "@/sharedComponets/ui/editor/Tag";
// import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import Thumnail from "@/sharedComponets/ui/editor/Thumnail";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TMedia } from "@/types/commonTypes";
import { TCategory } from "@/types/data";
import { TBlog } from "@/types/post";

import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "tinymce";

export default function EditBlogPage({ post }: { post: TBlog }) {
  // ref
  const editorRef = useRef<Editor | null>(null);

  const tempThumnail: TMedia = {
    _id: "",
    secure_url: post.thumnail?.url || "",
    resource_type: "image",
    asset_id: "",
    public_id: "",
    format: "",
    duration: undefined,
    width: post.thumnail?.width || 0,
    height: post.thumnail?.height || 0,
    size: 0,
  };

  //   const id = post.category;
  //   console.log(post)
  //   hook
  const [des, setDes] = useState(post.description || "");
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [excerp, setExcerp] = useState(post.excerp || "");
  const [thumnail, setThumnail] = useState<TMedia | null>(tempThumnail || null);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    post.category || null
  );
  const [updateBlog, { isLoading }] = useUpdatePostMutation();

  const handleUpdate = async () => {
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

    if (editorRef.current && !editorRef.current.getContent()) {
      toast.error("Content is required");
      return;
    }

    const blogData: TBlog = {
      title: post.title,
      slug: post.slug,
      description: des,
      excerp,
      thumnail: {
        width: thumnail?.width,
        height: thumnail?.height,
        url: thumnail?.secure_url,
      },
      tags,
      postType: "blog",
      category: selectedCategory,
      content: "",
    };

    if (editorRef.current) {
      blogData.content = editorRef.current.getContent();
    }

    try {
      const res = await updateBlog({
        slug: post.slug,
        data: blogData,
      }).unwrap();
      if (res.success) {
        toast.success("Post updated successfully");
      } else {
        toast.success(res?.message);
      }
    } catch (error: any) {
      console.log(error?.data?.message);
      toast.error(
        error?.data?.message || "Error occured updating post. Try again"
      );
    }
  };

  return (
    <>
      <div className=" w-full lg:fixed z-50 top-0 py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
        <PageTitle key="UPDATE_BLOG" title="Update Blog" />

        {isLoading ? (
          <div className="w-[110px] hidden lg:block">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-auto hidden lg:block">
            <Button className="!py-2.5" label="Update" cb={handleUpdate} />
          </div>
        )}
      </div>
      <div className="w-full relative grow lg:pt-20 max-w-[1160px] mx-auto">
        <h5 className="mb-5">{post.title}</h5>
        <Thumnail thumnail={thumnail} setThumnail={setThumnail} />
        <Description
          des={des}
          excerp={excerp}
          setExcerp={setExcerp}
          setDes={setDes}
        />

        <Tag tags={tags} setTags={setTags} />
        <Category
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <EditorContainer content={post.content} editorRef={editorRef} />

        {isLoading ? (
          <div className="w-[50px] lg:hidden mt-6 md:mt-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-auto lg:hidden mt-6 md:mt-8">
            <Button className="!py-2.5" label="Update" cb={handleUpdate} />
          </div>
        )}
      </div>
    </>
  );
}
