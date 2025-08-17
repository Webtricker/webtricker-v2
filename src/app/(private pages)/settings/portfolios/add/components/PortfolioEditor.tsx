"use client";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import { useAddPortfolioMutation } from "@/redux/features/portfolio/portfolioApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import CoverImage from "@/sharedComponets/ui/editor/CoverImage";
import Description from "@/sharedComponets/ui/editor/Description";
import DynamicInput from "@/sharedComponets/ui/editor/DynamicInput";
import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import PortfolioTechonology from "@/sharedComponets/ui/editor/PortfolioTechonology";
// import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import Thumnail from "@/sharedComponets/ui/editor/Thumnail";
import TitleInput from "@/sharedComponets/ui/editor/TitleInput";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TMedia } from "@/types/commonTypes";
import { ITechnology } from "@/types/data";
import { makeSlug } from "@/utils/blog";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "tinymce";

export default function PortfolioEditor() {
  // ref
  const editorRef = useRef<Editor | null>(null);

  //   hook
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [excerp, setExcerp] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [thumnail, setThumnail] = useState<TMedia | null>(null);
  const [coverImage, setCoverImage] = useState<TMedia | null>(null);
  const [selectedTechnology, setSelectedTechnology] =
    useState<ITechnology | null>(null);
  const [postPortfolio, { isLoading }] = useAddPortfolioMutation();

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!des.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!excerp.trim()) {
      toast.error("Excerp is required");
      return;
    }

    if (!selectedTechnology) {
      toast.error("Technology is required");
      return;
    }

    if (!liveLink) {
      toast.error("Live link is required");
      return;
    }

    if (!thumnail) {
      toast.error("Thumnail is required");
      return;
    }

    if (!coverImage) {
      toast.error("Cover image is required");
      return;
    }

    const portfolioData = {
      title,
      slug: `${makeSlug(title)}`,
      description: des,
      excerp,
      liveLink,
      technology: selectedTechnology,
      thumnail: {
        width: thumnail?.width,
        height: thumnail?.height,
        url: thumnail?.secure_url,
      },
      coverImage: {
        width: coverImage?.width,
        height: coverImage?.height,
        url: coverImage?.secure_url,
      },
      content: "",
    };

    if (editorRef.current) {
      portfolioData.content = editorRef.current.getContent();
    }

    try {
      const res = await postPortfolio({ data: portfolioData }).unwrap();
      if (res.success) {
        toast.success("Post added");

        // reset form fields
        // setTitle("");
        // setDes("");
        // setExcerp("");
        // setThumnail(null);
        // setCoverImage(null);
        // setSelectedTechnology(null);
        // setLiveLink("");
        // editorRef.current?.setContent("");
      } else {
        toast.error(res?.message);
      }
    } catch (error: any) {
      console.log(error?.data?.message);
      toast.error(
        error?.data?.message || "Error occured adding portfolio. Try again"
      );
    }
  };
  return (
    <>
      <div className=" w-full lg:fixed z-50 top-0 py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
        <PageTitle key="ADD_PORTFOLIO" title="Add Portfolio" />

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
        <CoverImage coverImage={coverImage} setCoverImage={setCoverImage} />
        <Thumnail thumnail={thumnail} setThumnail={setThumnail} />
        <Description
          des={des}
          excerp={excerp}
          setExcerp={setExcerp}
          setDes={setDes}
        />

        <DynamicInput
          key="Live_link_input"
          value={liveLink}
          setValue={setLiveLink}
          label="Live link"
          placeholder="Enter live link"
        />

        <PortfolioTechonology
          selectedTechnology={selectedTechnology}
          setSelectedTechnology={setSelectedTechnology}
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
