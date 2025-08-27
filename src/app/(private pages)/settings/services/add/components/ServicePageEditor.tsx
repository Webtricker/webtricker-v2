"use client";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import { useAddServiceMutation } from "@/redux/features/post/postApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import Description from "@/sharedComponets/ui/editor/Description";
import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import Tag from "@/sharedComponets/ui/editor/Tag";
import Thumnail from "@/sharedComponets/ui/editor/Thumnail";
import TitleInput from "@/sharedComponets/ui/editor/TitleInput";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TMedia } from "@/types/commonTypes";
import { makeSlug } from "@/utils/blog";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "tinymce";
import KeyService from "./KeyService";
import { TService } from "@/types/post";
import ServiceCategory from "./ServiceCategory";
import ServiceIcon from "./ServiceIcon";

export default function ServicePageEditor() {
  // ref
  const editorRef = useRef<Editor | null>(null);

  //   hook
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [keyServices, setKeyServices] = useState<string[]>([]);
  const [excerp, setExcerp] = useState("");
  const [thumnail, setThumnail] = useState<TMedia | null>(null);
  const [icon, setIcon] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [postService, { isLoading }] = useAddServiceMutation();

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!des.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!icon) {
      toast.error("Icon is required");
      return;
    }

    if (!tags.length) {
      toast.error("Tags required");
      return;
    }

    if (!keyServices.length) {
      toast.error("Sub services are required");
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

    if (!selectedCategory) {
      toast.error("Category is required");
      return;
    }

    if (!thumnail) {
      toast.error("Thumnail is required");
      return;
    }

    const serviceData: TService = {
      title,
      slug: `${makeSlug(title)}`,
      description: des,
      excerpt: excerp,
      thumnail: {
        width: thumnail?.width,
        height: thumnail?.height,
        url: thumnail?.secure_url,
      },
      subServices: keyServices,
      tags,
      icon,
      category: selectedCategory,
      content: "",
    };

    if (editorRef.current) {
      serviceData.content = editorRef.current.getContent();
    }

    try {
      const res = await postService({ data: serviceData }).unwrap();
      if (res.success) {
        toast.success("Service added");
        // reset form fields
        setTitle("");
        setDes("");
        setIcon("");
        setKeyServices([]);
        setTags([]);
        setExcerp("");
        setThumnail(null);
        setSelectedCategory(null);

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
        <PageTitle key="ADD_SERVICE" title="Add Service" />

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
        <ServiceIcon icon={icon} setIcon={setIcon} />
        <Thumnail thumnail={thumnail} setThumnail={setThumnail} />
        <Description
          des={des}
          excerp={excerp}
          setExcerp={setExcerp}
          setDes={setDes}
        />

        <KeyService keyServices={keyServices} setKeyServices={setKeyServices} />
        <Tag tags={tags} setTags={setTags} />
        <ServiceCategory
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
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
