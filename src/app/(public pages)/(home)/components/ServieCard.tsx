"use client";
import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import { IService } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ServiceCard = ({ service }: { service: IService }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    <div className="p-4 shadow-md border border-green-500 rounded-xl rounded-br-none">
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
          <p className="text-justify">{service.description.slice(0, 300)}</p>
        ) : (
          <p className="text-justify">{service.description}</p>
        )}

        <div className="flex items-baseline justify-between gap-2">
          <div className="mt-2 flex items-center gap-1">
            <p className="!text-xs">See more about:</p>
            <Link href={`/services/${service.slug}`}>
              <button className="underline text-base hover:text-green-500 flex items-center gap-1 duration-300">
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
