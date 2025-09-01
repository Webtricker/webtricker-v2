import Button from "@/sharedComponets/ui/buttons/Button";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { IMainHeader } from "@/types/componentsType";
import React from "react";
import { Control, Controller, useFieldArray, UseFormRegister } from "react-hook-form";

type Props = {
  control: Control<IMainHeader, any, IMainHeader>;
  register: UseFormRegister<IMainHeader>;
};

export default function MainHeaderLinks({ control, register }: Props) {
  const {
    fields: navlinks,
    append: addLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "links",
  });
  return (
    <>
      {navlinks.map((link,index) => (
        <div
          key={link?.href}
          className="flex w-full max-w-[1000px] relative gap-1 mb-2"
        >
          <input
            placeholder="Enter label"
            {...register(`links.${index}.label` as const)}
            className="page-input w-full min-w-[250px] max-w-[300px] pl-1 py-1.5 grow"
          />
          <input
            placeholder="href"
            {...register(`links.${index}.href` as const)}
            className="page-input min-w-[5  00px] py-0.5 px-1.5 grow"
          />
          <p className="flex items-center gap-1 wt_fs-lg ml-2 mr-10">
            <Controller
              control={control}
              name={`links.${index}.isExternal`}
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
            className="pl-2 wt_fs-lg"
          >
            {" "}
            <TrashCanIcon className="min-w-4 text-red-500" />
          </button>
        </div>
      ))}

      <div className="w-full flex">
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
