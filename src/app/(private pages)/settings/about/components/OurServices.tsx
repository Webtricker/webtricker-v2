import { PlusIcon } from "@/sharedComponets/ui/icons/Icons";
import { IAboutPage } from "@/types/pageTypes";
import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import MinusIcon from "./Icons";
import { toast } from "react-toastify";
type Props = {
  setValue: UseFormSetValue<IAboutPage>;
  data: IAboutPage;
};

export default function OurServices({ setValue, data }: Props) {
  // hooks
  const [services, setServices] = useState<string[]>(
    data?.whatWeOfferItems || []
  );
  const [val, setVal] = useState("");

  //   handlers
  const handleSelect = () => {
    if (!val) return;

    if (services.includes(val)) {
      toast.error(`${val} exists in selected service `);
      return;
    }

    setServices([...services, val]);
    setValue("whatWeOfferItems", services);
    setVal("");
  };

  const handleRemove = (s: string) => {
    const remaining = services.filter((item) => item !== s);
    setServices(remaining);
    setValue("whatWeOfferItems", remaining);
  };

  return (
    <ul className=" grow list-disc list-inside flex flex-wrap items-start gap-x-[6%] gap-y-2.5">
      {services.map((s, _i) => (
        <li
          className="w-[47%] wt_fs-md pl-1 flex items-center justify-between bg-slate-100/80 dark:bg-slate-900 gap-2 rounded-[6px]"
          key={_i}
        >
          {s}
          <button
            title="delete"
            type="button"
            onClick={() => handleRemove(s)}
            className="w-8 flex items-center justify-center border rounded-[4px] text-whtie px-3"
          >
            <MinusIcon />
          </button>
        </li>
      ))}

      <li className="w-[47%] flex gap-2 rounded-[6px] overflow-hidden border border-slate-300">
        <input
          value={val}
          type="text"
          className="px-1.5 wt_fs-md outline-none max-w-[80%]"
          onChange={(e) => setVal(e.target.value)}
          placeholder="Enter service"
        />
        <button
          type="button"
          onClick={handleSelect}
          className="bg-black dark:bg-white  w-[20%] text-whtie px-3"
        >
          <PlusIcon className="w-5 h-5 text-white dark:text-black" />
        </button>
      </li>
    </ul>
  );
}
