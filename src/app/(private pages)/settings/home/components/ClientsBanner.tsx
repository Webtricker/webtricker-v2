import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import { TMedia } from "@/types/commonTypes";
import { IHomePage } from "@/types/pageTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";

const ACTIVE_KEY = "OPEN_CLIENTS_BANNER_SLECTION_MODAL";

type Props = {
  setValue: UseFormSetValue<IHomePage>;
  clientsBanners: IHomePage["clientsBanners"];
};

type TModifiedData = {
  src: string;
  id: string;
};
export default function ClientsBanner({ setValue, clientsBanners }: Props) {
  const dispatch = useDispatch();
  const [openedItem, setOpenedItem] = useState<string | null>(null);
  const [items, setItems] = useState<TModifiedData[]>([]);

  useEffect(() => {
    if (clientsBanners) {
      setItems(
        clientsBanners?.length
          ? clientsBanners.map((item: string) => ({
              id: crypto.randomUUID(),
              src: item,
            }))
          : []
      );
    }
  }, [clientsBanners]);

  //   handlers
  const handleSelect = (media: TMedia) => {
    setItems((prev) => {
      let total: TModifiedData[] = [];
      if (openedItem) {
        total = prev.map((item) =>
          item.id === openedItem ? { id: item.id, src: media.secure_url } : item
        );
      } else {
        total = [
          ...prev,
          {
            id: crypto.randomUUID(),
            src: media.secure_url,
          },
        ];
      }

      //   set only the values.
      setValue(
        "clientsBanners",
        total.map((item) => item.src)
      );
      return total;
    });

    // hide the modal
    dispatch(toggleModal(null));
  };

  const handleDelete = (id: string) => {
    setItems((prev) => {
      const filtered = prev.filter((el) => el.id !== id);
      setValue(
        "clientsBanners",
        filtered.map((el) => el.src)
      );
      return filtered;
    });
  };

  const openModal = (id: string | null = null) => {
    setOpenedItem(id);
    dispatch(toggleModal(ACTIVE_KEY));
  };

  console.log(items, ' item from')

  return (
    <>
      <div className="flex max-w-[100%] overflow-x-auto border grow min-h-24 items-center">
        {items.map((item) => (
          <BannerItem
            onChange={() => openModal(item.id)}
            onDelete={() => handleDelete(item.id)}
            item={item}
            key={item.id}
          />
        ))}

        <div className="mx-5">
          <Button label="Add" type="button" className="" cb={openModal} />
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

const BannerItem = ({
  item,
  onChange,
  onDelete,
}: {
  item: TModifiedData;
  onChange: (id: string) => void;
  onDelete: (id: string) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(item.id)}
    className="w-20 min-w-20 h-20 rounded-full mx-2 border border-slate-300 dark:border-slate-700 relative"
  >
    <Image
      className="block w-full h-full rounded-full"
      src={item.src}
      width={100}
      height={100}
      alt={item.src}
    />
    <span
      onClick={(e) => {
        e.stopPropagation();
        onDelete(item.id);
      }}
      className="absolute top-0 right-0"
    >
      <TrashCanIcon className="min-w-3 text-red-500" />
    </span>
  </button>
);
