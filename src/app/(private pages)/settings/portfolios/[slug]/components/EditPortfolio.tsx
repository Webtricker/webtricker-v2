"use client";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import { useUpdatePortfolioMutation } from "@/redux/features/portfolio/portfolioApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import Description from "@/sharedComponets/ui/editor/Description";
import DynamicInput from "@/sharedComponets/ui/editor/DynamicInput";
import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import PortfolioTechonology from "@/sharedComponets/ui/editor/PortfolioTechonology";
import Thumnail from "@/sharedComponets/ui/editor/Thumnail";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TMedia } from "@/types/commonTypes";
import { ITechnology } from "@/types/data";
import { TPortfolio } from "@/types/portfolio";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "tinymce";

export default function EditPortfolio({
  portfolio,
}: {
  portfolio: TPortfolio;
}) {
  // ref
  const editorRef = useRef<Editor | null>(null);
  const tempThumnail: TMedia = {
    _id: "",
    secure_url: portfolio.thumnail?.url || "",
    resource_type: "image",
    asset_id: "",
    public_id: "",
    format: "",
    duration: undefined,
    width: portfolio.thumnail?.width || 0,
    height: portfolio.thumnail?.height || 0,
    size: 0,
  };

  //   hook
  const [des, setDes] = useState(portfolio.description || "");
  const [excerp, setExcerp] = useState(portfolio.excerp || "");
  const [liveLink, setLiveLink] = useState(portfolio.liveLink || "");
  const [thumnail, setThumnail] = useState<TMedia | null>(tempThumnail || null);
  const [selectedTechnology, setSelectedTechnology] =
    useState<ITechnology | null>(portfolio.technology || null);
  const [updatePortfolio, { isLoading }] = useUpdatePortfolioMutation();

  const handleSave = async () => {
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

    const portfolioData = {
      title: portfolio.title,
      slug: portfolio.slug,
      description: des,
      excerp,
      liveLink,
      technology: selectedTechnology,
      thumnail: {
        width: thumnail?.width,
        height: thumnail?.height,
        url: thumnail?.secure_url,
      },
      content: "",
    };

    if (editorRef.current) {
      portfolioData.content = editorRef.current.getContent();
    }

    try {
      const res = await updatePortfolio({
        slug: portfolio.slug,
        data: portfolioData,
      }).unwrap();
      if (res.success) {
        toast.success("Post updated");
      } else {
        toast.success(res?.message);
      }
    } catch (error: any) {
      console.log(error?.data?.message);
      toast.error(
        error?.data?.message || "Error occured updating portfolio. Try again"
      );
    }
  };
  return (
    <>
      <div className=" w-full lg:fixed z-50 top-0 py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
        <PageTitle key="UPDATE_PORTFOLIO" title="Update Portfolio" />

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
        <EditorContainer content={portfolio.content} editorRef={editorRef} />
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
