"use client"; 
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/sharedComponets/ui/buttons/Button";
import { ITopHeader } from "@/types/componentsType";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";

export default function BlogsPageForm() {
  const { control, register, handleSubmit } = useForm<ITopHeader>({
    defaultValues: {
      contactLinks: [{ icon: "", text: "" }],
      socialLinks: [{ icon: "", href: "" }],
    },
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

  const onSubmit: SubmitHandler<ITopHeader> = (data) => {
    console.log("Submitted data:", data);
    /**
     * data looks like:
     * {
     *   contactLinks: [ { icon: "phone", text: "123456" }, ... ],
     *   socialLinks: [ { icon: "facebook", href: "https://fb.com" }, ... ]
     * }
     */
  };
  // if (isLoading)
  //   return (
  //     <ConditionalReturnContainer>
  //       <LoadingSpinner />
  //     </ConditionalReturnContainer>
  //   );

  // if (!data)
  //   return (
  //     <ConditionalReturnContainer>
  //       <p>Add blogs page data</p>
  //     </ConditionalReturnContainer>
  //   );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border w-full max-w-[800px] border-slate-300 dark:border-slate-700 p-5 rounded-[10px]">
      {/* Contact Links Section */}
      <div className="w-full">
        <h5 className="font-bold mb-2">Contact Links</h5>
        {contactFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2 w-full">
            <input
              placeholder="Icon"
              {...register(`contactLinks.${index}.icon` as const)}
              className="page-input py-1.5 px-3 grow"
            />
            <input
              placeholder="Text"
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
        ))}
        <button
          type="button"
          onClick={() => addContact({ icon: "", text: "" })}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          + Add Contact
        </button>
      </div>

      {/* Social Links Section */}
      <div>
        <h5 className="font-bold mb-2">Social Links</h5>
        {socialFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              placeholder="Icon"
              {...register(`socialLinks.${index}.icon` as const)}
              className="page-input py-1.5 px-3"
            />
            <input
              placeholder="Href"
              {...register(`socialLinks.${index}.href` as const)}
              className="page-input py-1.5 px-3"
            />
            <button
              type="button"
              onClick={() => removeSocial(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addSocial({ icon: "", href: "" })}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          + Add Social
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
