import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { PlusIcon, TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { TMedia } from "@/types/commonTypes";
import { IHomePage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useState } from "react";
import {
    Control,
    useFieldArray,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";
import { useDispatch } from "react-redux";

// variables
const ACTIVE_KEY = "OPEN_TECHNOLOGY_ICON_MODAL";

type Props = {
    control: Control<IHomePage>;
    watch: UseFormWatch<IHomePage>;
    register: UseFormRegister<IHomePage>;
    setValue: UseFormSetValue<IHomePage>;
};

export default function Technologies({
    watch,
    control,
    register,
    setValue,
}: Props) {
    const dispatch = useDispatch();
    const updatedLinks = watch("technologies");

    const {
        fields: technologies,
        append: addTechnology,
        remove: removeTechnology,
    } = useFieldArray({
        control,
        name: "technologies",
    });
    const [activeIndex, setActiveIndex] = useState(0);

    // handlers
    const handleSelect = (media: TMedia) => {
        setValue(`technologies.${activeIndex}.icon`, media.secure_url, {
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
            <div className="w-full grid gap-5 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] items-center">
                {technologies.map((link, index) => {
                    const currentIcon = updatedLinks?.[index]?.icon;
                    return (
                        <div key={link.id} className="min-h-[145px] relative w-full flex flex-col items-center border border-slate-200 p-4 rounded-[4px]">
                            {currentIcon ? (
                                <Image
                                    onClick={() => handleClick(index)}
                                    className="min-w-[60px] min-h-[60px]"
                                    width={60} height={60} src={currentIcon} alt="Icon" />
                            ) : (
                                <button
                                    type="button"
                                    className="p-2 border border-slate-200 rounded-[3px]"
                                    onClick={() => handleClick(index)}
                                >
                                    <PlusIcon className="w-5 h-5 " />
                                </button>
                            )}
                            <input
                                placeholder="Enter name"
                                {...register(`technologies.${index}.name` as const)}
                                className="page-input mt-5 py-0.5 ml-1 px-1.5"
                            />
                            <button
                                type="button"
                                onClick={() => removeTechnology(index)}
                                className="absolute top-2 right-2"
                            >
                                <TrashCanIcon className="min-w-3 text-red-500" />
                            </button>
                        </div>
                    );
                })}

                <div className="w-full flex justify-center">
                    <Button
                        label="Add Technology"
                        type="button"
                        className="p-0 outline-0  border-0"
                        cb={() => addTechnology({ icon: "", name: "" })}
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
