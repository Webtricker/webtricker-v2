import Button from "@/sharedComponets/ui/buttons/Button";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { ISidebar } from "@/types/componentsType";
import React from "react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
    control: Control<ISidebar, string[]>
    register: UseFormRegister<ISidebar>;
};

export default function Phones({ control, register }: Props) {
    const {
        fields: phones,
        append: addPhone,
        remove: removePhone,
    } = useFieldArray({
        control,
        name: "information.phones" as "socialLinks.links",
    });
    return (
        <>
            <h6 className="mb-1 mt-5">Phones</h6>
            {phones.map((phone, index) => (
                <div
                    key={phone.id} // Use the unique ID provided by useFieldArray
                    className="flex w-full relative gap-4 items-center"
                >
                    <input
                        placeholder="Enter phone number"
                        {...register(`information.phones.${index}` as const)}
                        className="page-input w-full pl-2 py-1.5 max-w-[350px]"
                    />
                    <button
                        type="button"
                        onClick={() => removePhone(index)}
                        className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                    >
                        <TrashCanIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
            <div className="w-full flex">
                <Button
                    type="button"
                    className="!py-1.5 !px-4"
                    cb={() => addPhone("" as any)}
                    label="Add Phone"
                />
            </div>

        </>
    );
}
