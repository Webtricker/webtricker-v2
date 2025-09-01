import Button from "@/sharedComponets/ui/buttons/Button";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";

import { IContactPage } from "@/types/pageTypes";
import React from "react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
  control: Control<IContactPage, any, IContactPage>;
  register: UseFormRegister<IContactPage>;
};

export default function Addresses({ control, register }: Props) {
  const {
    fields: addedAddress,
    append: addAddress,
    remove: removeAddress,
  } = useFieldArray({
    control,
    name: "address.addresses",
  });
  return (
    <>
      {addedAddress.map((address, index) => (
        <address
          key={address.id}
          className="not-italic flex relative gap-1 mb-2"
        >
          <strong>
            {" "}
            <input
              placeholder="Enter Office"
              {...register(`address.addresses.${index}.office` as const)}
              className="page-input max-w-[150px] py-0.5 px-1.5 grow"
            />
          </strong>
          :{" "}
          <input
            placeholder="Enter office address"
            {...register(`address.addresses.${index}.location` as const)}
            className="page-input py-0.5 px-1.5 grow"
          />
          <button
            type="button"
            onClick={() => removeAddress(index)}
            className="pl-2"
          >
            {" "}
            <TrashCanIcon className="min-w-3 text-red-500" />
          </button>
        </address>
      ))}

      <div className="w-full flex justify-center">
        <Button
          type="button"
          className="p-0 outline-0  border-0 !py-1.5 mt-2"
          cb={() => addAddress({ office: "", location: "" })}
          label="Add Field"
        />
      </div>
    </>
  );
}