
"use client";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import { useGetTermsAndConditionPageDataQuery, useUpdateTermsAndConditionPageDataMutation } from "@/redux/features/pageData/pageData";
import Button from "@/sharedComponets/ui/buttons/Button";
import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import { IPolicyPage } from "@/types/pageTypes";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Editor } from "tinymce";

export default function TermsAndConditionsPage() {
    // ref
    const editorRef = useRef<Editor | null>(null);
    const { data, isLoading: isPageLoading } = useGetTermsAndConditionPageDataQuery({})
    const pageData = data?.data || {} as IPolicyPage;

    //   hook
    const [title, setTitle] = useState("");
    const [des, setDes] = useState("");

    const [updateTermsAndCondition, { isLoading }] = useUpdateTermsAndConditionPageDataMutation();

    useEffect(() => {
        if (data?.data) {
            setTitle(data?.data?.title)
            setDes(data?.data?.description)
        }
    }, [data?.data])



    // handlers
    const handleSave = async () => {
        console.log(title, des);
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!des.trim()) {
            toast.error("Description is required");
            return;
        }

        const pageData: IPolicyPage = {
            title,
            content: '',
            description: des
        };

        if (editorRef.current) {
            pageData.content = editorRef.current.getContent();
        }

        try {
            const res = await updateTermsAndCondition({ id: data?.data?._id || '', data: pageData }).unwrap();
            if (res.success) {
                toast.success("Post added");
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


    if (isPageLoading)
        return (
            <ConditionalReturnContainer>
                <LoadingSpinner />
            </ConditionalReturnContainer>
        );

    if (!data)
        return (
            <ConditionalReturnContainer>
                <p>Add Terms and Conditions page data</p>
            </ConditionalReturnContainer>
        )

    return (
        <>
            <div className=" w-full lg:fixed z-50 top-0 py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
                <PageTitle key="UPDATE_TERMS_AND_CONDITIONS" title="Update Terms & Condition Page" />

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
            <div className="w-full relative grow lg:pt-20 max-w-[1160px] mx-auto">
                <div className='w-full mb-5 lg:mb-10'>
                    <label className='wt_fs-md mb-1 block'>Title</label>
                    <textarea value={title} className='wt_fs-md px-4 py-2.5 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px] w-full ' placeholder='Enter title' onChange={(e) => setTitle(e.target.value)} ></textarea>
                </div>
                <div className="w-full mb-5 lg:mb-10">
                    <label className="wt_fs-md mb-1 block">Description</label>
                    <textarea
                        className="wt_fs-md min-h-[150px] px-4 py-2.5 lg:py-3 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px] w-full "
                        placeholder="Enter description"
                        onChange={(e) => setDes(e.target.value)}
                        value={des}
                    />
                </div>
                <EditorContainer content={pageData?.content || ""} editorRef={editorRef} />

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
