import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { PlusIcon, TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { TMedia } from "@/types/commonTypes";
import { IFooter, ISidebar } from "@/types/componentsType";
import Image from "next/image";
import React, { useState } from "react";
import {
    Control,
    Controller,
    useFieldArray,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";
import { useDispatch } from "react-redux";

// variables
const ACTIVE_KEY = "OPEN_SIDEBAR_SOCIAL_ICON_MODAL";

type Props = {
    control: Control<ISidebar, any, ISidebar>;
    watch: UseFormWatch<ISidebar>;
    register: UseFormRegister<ISidebar>;
    setValue: UseFormSetValue<ISidebar>;
};

export default function SocialLinks({
    watch,
    control,
    register,
    setValue,
}: Props) {
    const dispatch = useDispatch();
    const updatedLinks = watch("socialLinks.links");

    const {
        fields: socialLinks,
        append: addLink,
        remove: removeLink,
    } = useFieldArray({
        control,
        name: "socialLinks.links",
    });
    const [activeIndex, setActiveIndex] = useState(0);

    // handlers
    const handleSelect = (media: TMedia) => {
        setValue(`socialLinks.links.${activeIndex}.label`, media.secure_url, {
            shouldDirty: true,
        });
        dispatch(toggleModal(null));
    };

    const handleClick = (index: number) => {
        setActiveIndex(index);
        dispatch(toggleModal(ACTIVE_KEY));
    };

    return (
        <>
            <div className="flex flex-col gap-3 w-full max-w-[900px]">
                {socialLinks.map((link, index) => {
                    const currentIcon = updatedLinks?.[index]?.label;
                    return (
                        <div key={link.id} className="flex relative gap-5 w-full">
                            <div className="w-full flex items-center gap-4 min-w-[220px]">
                                {currentIcon ? (
                                    <Image
                                        onClick={() => handleClick(index)}
                                        width={25}
                                        height={25}
                                        src={currentIcon}
                                        alt="Icon"
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        className="!py-2.5"
                                        onClick={() => handleClick(index)}
                                    >
                                        <PlusIcon className="w-5 h-5 " />
                                    </button>
                                )}
                                <input
                                    placeholder="Enter link"
                                    {...register(`socialLinks.links.${index}.href` as const)}
                                    className="page-input py-0.5 ml-1 px-1.5 grow"
                                />

                                <p className="flex items-center gap-1 wt_fs-lg ml-2 mr-10">
                                    <Controller
                                        control={control}
                                        name={`socialLinks.links.${index}.isExternal`}
                                        render={({ field }) => (
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                className="w-5 h-5"
                                            />
                                        )}
                                    />
                                    <span>target=&apos;_blank&apos; ?</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => removeLink(index)}
                                    className="pl-3"
                                >
                                    <TrashCanIcon className="min-w-3 text-red-500" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                <div className="w-full flex mt-3">
                    <Button
                        label="Add Link"
                        className="!py-2"
                        cb={() => addLink({ label: "", href: "", isExternal: false })}
                    />
                </div>
            </div>

            <MediaModal
                allowedMediaTypeToShow={["img"]}
                activeKey={ACTIVE_KEY}
                key={ACTIVE_KEY}
                cb={handleSelect}
            />
        </>
    );
}
