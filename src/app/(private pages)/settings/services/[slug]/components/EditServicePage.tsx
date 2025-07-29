"use client";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import { useUpdateServiceMutation } from "@/redux/features/post/postApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import Description from "@/sharedComponets/ui/editor/Description";
import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import Tag from "@/sharedComponets/ui/editor/Tag";
import Thumnail from "@/sharedComponets/ui/editor/Thumnail";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TMedia } from "@/types/commonTypes";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "tinymce";
import { IService, TService } from "@/types/post";
import KeyService from "../../add/components/KeyService";
import ServiceCategory from "../../add/components/ServiceCategory";
import ServiceIcon from "../../add/components/ServiceIcon";

export default function EditServicePage({ service }: { service: IService }) {
  // ref
  const editorRef = useRef<Editor | null>(null);
  const tempThumnail: TMedia = {
    _id: "",
    secure_url: service.thumnail?.url || "",
    resource_type: "image",
    asset_id: "",
    public_id: "",
    format: "",
    duration: undefined,
    width: service.thumnail?.width || 0,
    height: service.thumnail?.height || 0,
    size: 0,
  };

  //   hook
  const [des, setDes] = useState(service.description || "");
  const [tags, setTags] = useState<string[]>(service.tags || []);
  const [keyServices, setKeyServices] = useState<string[]>(
    service.subServices || []
  );
  const [icon, setIcon] = useState(service.icon || "");
  const [excerp, setExcerp] = useState(service.excerp || "");
  const [thumnail, setThumnail] = useState<TMedia | null>(tempThumnail || null);
  const [selectedCategory, setSelectedCategory] = useState(
    service.category || null
  );
  const [updateService, { isLoading }] = useUpdateServiceMutation();

  const handleSave = async () => {
    if (!des.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!tags.length) {
      toast.error("Tags required");
      return;
    }

    if (!icon) {
      toast.error("Icon is required");
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

    if (!thumnail) {
      toast.error("Thumnail is required");
      return;
    }

    if (editorRef.current && !editorRef.current.getContent()) {
      toast.error("Content is required");
      return;
    }

    const serviceData: TService = {
      title: service.title,
      slug: service.slug,
      description: des,
      excerp,
      thumnail: {
        width: thumnail?.width,
        height: thumnail?.height,
        url: thumnail?.secure_url,
      },
      icon,
      subServices: keyServices,
      tags,
      category: selectedCategory || "",
      content: "",
    };

    if (editorRef.current) {
      serviceData.content = editorRef.current.getContent();
    }

    try {
      const res = await updateService({
        slug: service.slug,
        data: serviceData,
      }).unwrap();
      if (res.success) {
        toast.success("Service updated successfully");
      } else {
        toast.success(res?.message);
      }
    } catch (error: any) {
      console.log(error?.data?.message);
      toast.error(
        error?.data?.message || "Error occured updating service. Try again"
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
        <EditorContainer content={service.content} editorRef={editorRef} />

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
