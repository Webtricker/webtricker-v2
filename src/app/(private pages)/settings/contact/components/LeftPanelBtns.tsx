import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { PlusIcon, TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { TMedia } from "@/types/commonTypes";
import { IContactPage } from "@/types/pageTypes";
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
const ACTIVE_KEY = "OPEN_LEFT_PANEL_SOCIAL_ICON_MODAL";

type Props = {
  control: Control<IContactPage, any, IContactPage>;
  watch: UseFormWatch<IContactPage>;
  register: UseFormRegister<IContactPage>;
  setValue: UseFormSetValue<IContactPage>;
};

export default function LeftPanelBtns({
  watch,
  control,
  register,
  setValue,
}: Props) {
  const dispatch = useDispatch();
  const updatedLinks = watch("leftPanel.socialLinks");

  const {
    fields: socialLinks,
    append: addLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "leftPanel.socialLinks",
  });
  const [activeIndex, setActiveIndex] = useState(0);

  // handlers
  const handleSelect = (media: TMedia) => {
    setValue(`leftPanel.socialLinks.${activeIndex}.icon`, media.secure_url, {
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
      <div className="flex flex-col absolute left-0 bottom-0 gap-5 w-5">
        {socialLinks.map((link, index) => {
          const currentIcon = updatedLinks?.[index]?.icon;
          return (
            <div key={link.id} className="flex relative gap-5 mb-4 w-full">
              <div className="w-full flex items-center absolute min-w-[220px]">
                {currentIcon ? (
                  <Image width={20} height={20} src={currentIcon} alt="Icon" />
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
                  {...register(`leftPanel.socialLinks.${index}.href` as const)}
                  className="page-input py-0.5 ml-1 px-1.5 wt_fs-xs grow"
                />
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

        <div className="w-full flex justify-center">
          <button
            type="button"
            className="p-0 outline-0  border-0"
            onClick={() => addLink({ icon: "", href: "" })}
          >
            {" "}
            <PlusIcon className="w-4 h-4 " />
          </button>
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
