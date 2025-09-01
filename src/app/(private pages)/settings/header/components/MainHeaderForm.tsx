"use client";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IMainHeader } from "@/types/componentsType";
import Button from "@/sharedComponets/ui/buttons/Button";
import {
  useGetMainHeaderDataQuery,
  useUpdateMainHeaderDataMutation,
} from "@/redux/features/componentsCustomization/customizationApiSlice";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { toast } from "react-toastify";
import MainHeaderLogos from "./MainHeaderLogos";
import MainHeaderLinks from "./MainHeaderLinks";

export default function MainHeaderForm() {
  const { data: headerData, isLoading } = useGetMainHeaderDataQuery({});
  const [updateTopHeader, { isLoading: isUpdating }] =
    useUpdateMainHeaderDataMutation();

  // hook form necessary fields
  const { control, reset, setValue, register, handleSubmit } =
    useForm<IMainHeader>();

  // react & form hooks
  const onSubmit: SubmitHandler<IMainHeader> = async (data) => {
    console.log("Submitted data:", data);
    try {
      const res = await updateTopHeader({
        id: headerData?.data?._id,
        data,
      }).unwrap();
      if (res.success) {
        toast.success("Updated main header");
      }
    } catch (error) {
      console.log(error, " error updating main header data");
      toast.error("Error updating. Try again");
    }
  };

  // when headerData arrives, reset form values
  useEffect(() => {
    if (headerData?.data) {
      reset(headerData.data);
    }
  }, [headerData, reset]);

  if (isLoading)
    return (
      <ConditionalReturnContainer>
        <LoadingSpinner />
      </ConditionalReturnContainer>
    );
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border w-full max-w-[1100px] my-20 border-slate-300 dark:border-slate-700 p-5 md:p-10 rounded-[10px]"
      >
        <MainHeaderLogos logo={headerData?.data?.logo} setValue={setValue} />

        <div className="w-full mt-5">
          <MainHeaderLinks control={control} register={register} />
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
