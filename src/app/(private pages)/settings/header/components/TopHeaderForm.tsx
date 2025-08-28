"use client";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { ITopHeader } from "@/types/componentsType";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { TMedia } from "@/types/commonTypes";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import Button from "@/sharedComponets/ui/buttons/Button";
import Image from "next/image";
import {
  useGetTopHeaderDataQuery,
  useUpdateTopHeaderDataMutation,
} from "@/redux/features/componentsCustomization/customizationApiSlice";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { toast } from "react-toastify";

type TActionType = {
  target: "socialLinks" | "contactLinks";
  index: number;
};

// variables
const ACTIVE_KEY = "OPEN_HEADER_TOP_ICON_MODAL";

export default function BlogsPageForm() {
  const dispatch = useDispatch();
  const { data: headerData, isLoading } = useGetTopHeaderDataQuery({});
  const [updateTopHeader, { isLoading: isUpdating }] =
    useUpdateTopHeaderDataMutation();

  // form default value
  const defaultValues: ITopHeader = {
    contactLinks: headerData?.data?.contactLinks ?? [{ icon: "", text: "" }],
    socialLinks: headerData?.data?.socialLinks ?? [{ icon: "", href: "" }],
  };

  // hook form necessary fields
  const { control, reset, watch, setValue, register, handleSubmit } =
    useForm<ITopHeader>({
      defaultValues,
    });

  // Dynamic arrays
  const {
    fields: contactFields,
    append: addContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "contactLinks",
  });

  const {
    fields: socialFields,
    append: addSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "socialLinks",
  });

  // react & form hooks
  const [actionType, setActionType] = useState<TActionType | null>(null);
  const contacts = watch("contactLinks");
  const socials = watch("socialLinks");

  const onSubmit: SubmitHandler<ITopHeader> = async (data) => {
    console.log("Submitted data:", data);
    try {
      const res = await updateTopHeader({
        id: headerData?.data?._id,
        data,
      }).unwrap();
      if (res.success) {
        toast.success("Updated top header");
      }
    } catch (error) {
      console.log(error, " error updating top header data");
      toast.error("Error updating. Try again");
    }
  };

  // handlers
  const handleSelect = (media: TMedia) => {
    dispatch(toggleModal(null));
    if (!actionType) return;

    setValue(
      `${actionType.target}.${actionType.index}.icon`,
      media.secure_url,
      {
        shouldDirty: true,
      }
    );
    // reset the value
    setActionType(null);
  };

  const handleChange = (action: TActionType) => {
    setActionType(action);
    dispatch(toggleModal(ACTIVE_KEY));
  };

  // when headerData arrives, reset form values
  useEffect(() => {
    if (headerData?.data) {
      reset({
        contactLinks: headerData.data.contactLinks ?? [{ icon: "", text: "" }],
        socialLinks: headerData.data.socialLinks ?? [{ icon: "", href: "" }],
      });
    }
  }, [headerData, reset]);

  if (isLoading)
    return (
      <ConditionalReturnContainer>
        <LoadingSpinner />
      </ConditionalReturnContainer>
    );

  console.log(contactFields, " contact fields");
  console.log(defaultValues, " default values");

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border w-full max-w-[800px] border-slate-300 dark:border-slate-700 p-5 md:p-10 rounded-[10px]"
      >
        {/* Contact Links Section */}
        <div className="w-full">
          <h6 className="font-bold mb-5">Contact Links</h6>
          {contactFields.map((field, index) => {
            const currentIcon = contacts?.[index]?.icon; // watch value

            return (
              <div key={field.id} className="flex gap-5 mb-5 w-full">
                {currentIcon ? (
                  <Image width={40} height={40} src={currentIcon} alt="Icon" />
                ) : (
                  <Button
                    label="Add Icon"
                    className="!py-2.5"
                    cb={() => handleChange({ index, target: "contactLinks" })}
                  />
                )}
                <input
                  placeholder="Enter text"
                  {...register(`contactLinks.${index}.text` as const)}
                  className="page-input py-1.5 px-3 grow"
                />
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="pl-3"
                >
                  <TrashCanIcon className="min-w-6 text-red-500" />
                </button>
              </div>
            );
          })}

          <div className="w-full flex justify-center">
            <Button
              label="Add Contact"
              className="!py-2.5"
              cb={() => addContact({ icon: "", text: "" })}
            />
          </div>
        </div>

        {/* Social Links Section */}
        <div className="w-full my-10">
          <h6 className="font-bold mb-5">Social Links</h6>
          {socialFields.map((field, index) => {
            const currentIcon = socials?.[index]?.icon;
            return (
              <div key={field.id} className="flex gap-5 mb-5 w-full">
                {currentIcon ? (
                  <Image width={40} height={40} src={currentIcon} alt="Icon" />
                ) : (
                  <Button
                    label="Add Icon"
                    className="!py-2.5"
                    cb={() => handleChange({ index, target: "socialLinks" })}
                  />
                )}
                <input
                  placeholder="Enter link"
                  {...register(`socialLinks.${index}.href` as const)}
                  className="page-input py-1.5 px-3 grow"
                />
                <button
                  type="button"
                  onClick={() => removeSocial(index)}
                  className="pl-3"
                >
                  <TrashCanIcon className="min-w-6 text-red-500" />
                </button>
              </div>
            );
          })}
          <div className="w-full flex justify-center">
            <Button
              label="Add Social"
              className="!py-2.5"
              cb={() => addSocial({ icon: "", href: "" })}
            />
          </div>
        </div>

        {isUpdating ? (
          <LoadingSpinner />
        ) : (
          <Button label="Save" type="submit" className="!py-2.5" />
        )}
      </form>

      <MediaModal
        allowedMediaTypeToShow={["img"]}
        activeKey={ACTIVE_KEY}
        key={ACTIVE_KEY}
        cb={handleSelect}
      />
    </>
  );
}
