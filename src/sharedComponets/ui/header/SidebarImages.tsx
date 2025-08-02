"use client";
import { useLazyGetServicesQuery } from "@/redux/features/post/postApi";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../loading/LoadingSpinner";
import { IService } from "@/types/post";
import Link from "next/link";

export default function SidebarImages() {
  const [getServices, { isLoading }] = useLazyGetServicesQuery();
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getServices(4).unwrap();
        if (response.success) {
          setServices(response.services);
        }
        console.log(response, " response from sidebar");
      } catch (error: any) {
        console.log(error?.data?.message || "");
      }
    };

    // initial call
    loadData();
  }, [getServices]);

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center min-h-20">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className=" w-full flex  gap-3 mt-20">
      {services.map((service) => (
        <Link className="w-full" href={`/services/${service.slug}`} key={service?._id}>
          <Image
            className="w-full min-h-full rounded-[5px] object-cover"
            src={service?.thumnail?.url}
            width={50}
            height={50}
            alt={service.category}
          />
        </Link>
      ))}
    </div>
  );
}
