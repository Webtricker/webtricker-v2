"use client";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import { IService } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ServiceCard = ({ service }: { service: IService }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div
      className={`p-4 shadow-md border border-slate-300 rounded-xl rounded-br-none hover:shadow-xl duration-300 dark:shadow-md dark:shadow-white dark:hover:shadow-xl dark:hover:shadow-slate-600  ${
        !showDetails && "max-h-[355px]"
      }`}
      id={service._id}
    >
      <div className="flex items-center gap-4">
        <Image
          width={40}
          height={40}
          className="h-auto"
          alt="Service icon"
          src={service.icon || ""}
        />
        <h6 className="heading font-bold">{service.title}</h6>
      </div>
      <div className="mt-2">
        {!showDetails ? (
          <p className="text-justify">
            {service?.description?.split(" ").slice(0, 50).join(" ")}
          </p>
        ) : (
          <p className="text-justify">{service.description}</p>
        )}

        <div className="flex items-baseline justify-between gap-1 md:gap-2">
          <div className="mt-2 flex items-center gap-1">
            <p className="!text-base">Case study:</p>
            <Link href={`/services/${service.slug}`}>
              <button className="underline text-[14px] hover:text-[var(--clr-danger)] flex items-center gap-1 duration-300">
                {service.title} <ArrowUpRightIcon />
              </button>
            </Link>
          </div>
          <span
            className="text-4xl font-bold cursor-pointer"
            onClick={() => setShowDetails((prevState) => !prevState)}
          >
            +
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
