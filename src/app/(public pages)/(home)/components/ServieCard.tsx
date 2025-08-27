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

    <div className="p-4 shadow-md">
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

        <button
          className="font-bold"
          onClick={() => setShowDetails((prevState) => !prevState)}
        >
          Show more
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
