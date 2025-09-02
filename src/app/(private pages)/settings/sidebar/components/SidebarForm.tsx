"use client"
import { useGetSidebarDataQuery, useUpdateSidebarDataMutation } from '@/redux/features/componentsCustomization/customizationApiSlice';
import LoadingSpinner from '@/sharedComponets/ui/loading/LoadingSpinner';
import ConditionalReturnContainer from '@/sharedComponets/ui/wrapper/ConditionalReturnContainer';
import { ISidebar } from '@/types/componentsType';
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import SidebarLogo from './SidebarLogo';
import Button from '@/sharedComponets/ui/buttons/Button';
import SidebarImages from '@/sharedComponets/ui/header/SidebarImages';
import { XMarkIcon } from '@/sharedComponets/ui/icons/Icons';
import Phones from './Phones';
import Emails from './Emails';
import Addresses from './Addresses';
import SocialLinks from './SocialLinks';

const description = `Looking for a digital partner? We're a full-service agency providing planning, design, development, debugging, and SEO. Let&apos;s collaborate to grow your business and achieve success.`

export default function SidebarForm() {
    const { data: sidebarData, isLoading } = useGetSidebarDataQuery({});
    const [updateSidebar, { isLoading: isUpdating }] =
        useUpdateSidebarDataMutation();

    // hook form necessary fields
    const { control, reset, setValue, watch, register, handleSubmit } =
        useForm<ISidebar>();

    // react & form hooks
    const onSubmit: SubmitHandler<ISidebar> = async (data) => {
        console.log(data, 'sidebar data ')
        try {
            const res = await updateSidebar({
                id: sidebarData?.data?._id,
                data,
            }).unwrap();
            if (res.success) {
                toast.success("Updated sidebar");
            }
        } catch (error) {
            console.log(error, " error updating sidebar data");
            toast.error("Error updating. Try again");
        }
    };

    // when sidebarData arrives, reset form values
    useEffect(() => {
        if (sidebarData?.data) {
            reset(sidebarData.data);
        }
    }, [sidebarData?.data, reset]);

    if (isLoading)
        return (
            <ConditionalReturnContainer>
                <LoadingSpinner />
            </ConditionalReturnContainer>
        );
    if (!sidebarData?.data)
        return (
            <ConditionalReturnContainer>
                <p>Sidebar data not found</p>
            </ConditionalReturnContainer>
        );
    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="border w-full max-w-[1000px] mx-auto my-20 border-slate-300 dark:border-slate-700 p-5 md:px-8 rounded-[10px]"
            >


                <div className="w-full pb-5 flex items-center justify-between">
                    <SidebarLogo shortLogo={sidebarData?.data?.shortLogo || ""} setValue={setValue} />
                    <XMarkIcon />
                </div>

                {/* content */}
                <div
                    className="sidebar_scrollable_container grow w-full overflow-y-auto"
                >
                    <div className="w-full mt-5 lg:mt-16">
                        <h5 className="heading font-semibold text-center lg:text-start">
                            <input
                                id="title"
                                className="page-input w-full pl-1 py-1 leading_normal"
                                {...register("title", { required: true })}
                                placeholder="Your Digital Partner for Success"
                            />
                        </h5>
                        <p className="mt-2 text-center lg:text-start">
                            <textarea
                                id="title"
                                className="page-input w-full min-h-[100px] pl-1 py-1 leading_normal"
                                {...register("description", { required: true })}
                                placeholder={description}
                            ></textarea>

                        </p>
                    </div>
                    <div className="w-full hidden lg:block">
                        <SidebarImages />
                    </div>

                    {/* company information */}
                    <div className="w-full flex flex-col items-center lg:items-start gap-3 mt-10 lg:mt-20">
                        <h6 className="heading uppercase mb-1"><input
                            id="information.title"
                            className="page-input w-full pl-1 py-1 leading_normal"
                            {...register("information.title", { required: true })}
                            placeholder="INFORMATION"
                        /></h6>

                        <Phones control={control} register={register} />
                        <Emails control={control} register={register} />
                        <Addresses control={control} register={register} />
                    </div>

                    {/* social links */}
                    <div className="w-full flex flex-col  gap-3 mt-14 lg:mt-20">
                        <h6 className="heading uppercase mb-2 text-center lg:text-start">
                            <input
                                id="socialLinks.title"
                                className="page-input w-full max-w-[450px] pl-1 py-1 leading_normal"
                                {...register("socialLinks.title", { required: true })}
                                placeholder="FOLLOW US"
                            />
                        </h6>
                        <div className="w-full flex gap-5 lg:gap-6 xl:gap-7 flex-wrap">
                            <SocialLinks control={control} register={register} setValue={setValue} watch={watch} />
                        </div>
                    </div>
                </div>

                <div className="w-full mt-5">
                    {isUpdating ? (
                        <LoadingSpinner />
                    ) : (
                        <Button label="Save" type="submit" className="!py-2.5" />
                    )}
                </div>
            </form>
        </>
    );
}
