"use client";
import { TService } from "@/types/data";
import Image from "next/image";
import { useState } from "react";

const ServiceCard = ({ service }: { service: TService }) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  return (
    // <div className="flex items-center gap-5 md:gap-6 lg:gap-8 2xl:gap-10">
    //   <Image
    //     width={40}
    //     height={40}
    //     className="h-auto"
    //     alt="Service icon"
    //     src={service.icon || ""}
    //   />
    //   <div className="grow">
    //     <h6 className="heading font-semibold">{service.title}</h6>
    //     <p>{service.excerpt}</p>
    //   </div>
    // </div>

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
            <p className="!text-base">For more:</p>
            <button className="font-semibold underline">Click here</button>
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
