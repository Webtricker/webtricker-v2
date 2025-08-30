import Button from "@/sharedComponets/ui/buttons/Button";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { IContactPage } from "@/types/pageTypes";
import React from "react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
  control: Control<IContactPage>;
  register: UseFormRegister<IContactPage>;
};

export default function Phones({ control, register }: Props) {
  const {
    fields: updatedNumbers,
    append: addPhone,
    remove: removePhone,
  } = useFieldArray<IContactPage, any>({
    control,
    name: "contactNumber.numbers",
  });

  return (
    <>
      {updatedNumbers.map((field, index) => (
        <div key={field.id} className="flex relative gap-1 mb-2">
          <input
            placeholder="Enter phone number"
            {...register(`contactNumber.numbers.${index}` as const)}
            className="page-input py-0.5 px-1.5 grow"
          />
          <button
            type="button"
            onClick={() => removePhone(index)}
            className="pl-2"
          >
            <TrashCanIcon className="min-w-3 text-red-500" />
          </button>
        </div>
      ))}

      <div className="w-full flex justify-center">
        <Button
          type="button"
          className="p-0 outline-0 border-0 !py-1.5 mt-2"
          cb={() => addPhone("")}
          label="Add Field"
        />
      </div>
    </>
  );
}
