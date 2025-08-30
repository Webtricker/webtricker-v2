import Button from "@/sharedComponets/ui/buttons/Button";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { IFooter } from "@/types/componentsType";
import React from "react";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
  control: Control<IFooter, any, IFooter>;
  register: UseFormRegister<IFooter>;
};

export default function ServicesLinks({ control, register }: Props) {
  const {
    fields: pageLinks,
    append: addLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "services.links",
  });
  return (
    <>
      {pageLinks.map((address, index) => (
        <div
          key={address.id}
          className="flex w-full max-w-[1000px] relative gap-1 mb-2"
        >
          <input
            placeholder="Enter label"
            {...register(`services.links.${index}.label` as const)}
            className="page-input w-full min-w-[250px] max-w-[300px] pl-1 py-1.5 grow"
          />
          <input
            placeholder="href"
            {...register(`services.links.${index}.href` as const)}
            className="page-input min-w-[5  00px] py-0.5 px-1.5 grow"
          />
          <p className="flex items-center gap-1 wt_fs-lg ml-2 mr-10">
            <input
              {...register(`services.links.${index}.isExternal` as const)}
              type="checkbox"
              className="w-5 h-5"
              name=""
              id=""
            />
            <span>target=&apos;_blank&apos; ?</span>
          </p>
          <button
            type="button"
            onClick={() => removeLink(index)}
            className="pl-2 wt_fs-lg"
          >
            {" "}
            <TrashCanIcon className="min-w-4 text-red-500" />
          </button>
        </div>
      ))}

      <div className="w-full flex justify-start">
        <Button
          type="button"
          className="p-0 outline-0  border-0 !py-1.5 mt-2"
          cb={() => addLink({ href: "", label: "", isExternal: false })}
          label="Add Link"
        />
      </div>
    </>
  );
}
