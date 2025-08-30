import Button from "@/sharedComponets/ui/buttons/Button";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { IContactPage } from "@/types/pageTypes";
import React from "react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
  control: Control<IContactPage>;
  register: UseFormRegister<IContactPage>;
};

export default function Mails({ control, register }: Props) {
  const {
    fields: mails,
    append: addMail,
    remove: removeMail,
  } = useFieldArray<IContactPage, any>({
    control,
    name: "contactMails.mails",
  });

  return (
    <>
      {mails.map((field, index) => (
        <div key={field.id} className="flex relative gap-1 mb-2">
          <input
            placeholder="Enter mail"
            {...register(`contactMails.mails.${index}` as const)}
            className="page-input py-0.5 px-1.5 grow"
          />
          <button
            type="button"
            onClick={() => removeMail(index)}
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
          cb={() => addMail("")}
          label="Add Field"
        />
      </div>
    </>
  );
}
