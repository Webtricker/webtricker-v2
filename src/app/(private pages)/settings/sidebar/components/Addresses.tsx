import Button from "@/sharedComponets/ui/buttons/Button";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { ISidebar } from "@/types/componentsType";
import React from "react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
    control: Control<ISidebar>
    register: UseFormRegister<ISidebar>;
};

export default function Addresses({ control, register }: Props) {
    const {
        fields: addresses,
        append: addAddress,
        remove: removeAddress,
    } = useFieldArray({
        control,
        name: "information.addresses" as "socialLinks.links",
    });
    return (
        <>
            <h6 className="mb-1 mt-5">Addresses</h6>
            {addresses.map((phone, index) => (
                <div
                    key={phone.id} // Use the unique ID provided by useFieldArray
                    className="flex w-full relative gap-4 items-center"
                >
                    <textarea
                        placeholder="Enter address"
                        {...register(`information.addresses.${index}` as const)}
                        className="page-input w-full min-h-[100px] pl-2 py-1.5"
                    />
                    <button
                        type="button"
                        onClick={() => removeAddress(index)}
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
                    cb={() => addAddress("" as any)}
                    label="Add Address"
                />
            </div>

        </>
    );
}
