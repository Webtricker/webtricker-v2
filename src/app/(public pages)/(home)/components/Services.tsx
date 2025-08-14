import galleryModern from "@/app/fonts/gallery";
import LinkButton from "@/sharedComponets/ui/buttons/LinkButton";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TService } from "@/types/data";
import { getServicesData } from "@/utils/pageData";
import Image from "next/image";
import React from "react";

const ServiceCard = ({ service }: { service: TService }) => {
  return (
    <div className="flex items-start gap-5 md:gap-6 lg:gap-8 2xl:gap-10">
      <Image
        width={60}
        height={66}
        className="h-auto"
        alt="Service icon"
        src={service.icon || ""}
      />
      <div className="grow">
        <h6 className="heading font-semibold mb-1 uppercase">
          {service.title}
        </h6>
        <p>{service.excerpt}</p>
      </div>
    </div>
  );
};

// ====== root component ======
export default async function Services() {
  const serviceData = await getServicesData(4)
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <Container>
        <div className="w-full flex-col md:flex-row gap-10 sm:gap-16 md:gap-10 flex justify-between">
          <div className="w-full">
            <h2 className="heading inline !leading-[100%]">Thoughtful</h2>
            <div className="w-full flex flex-wrap lg:flex-nowrap items-end gap-2">
              <h2
                className={`heading !leading-[100%] ${galleryModern.className}`}
              >
                Process
              </h2>
              <h6 className="mb-2 md:mb-4 heading">We Think a lot</h6>
            </div>
            <LinkButton
              className="mt-5"
              label="See All Services"
              href="/services"
            />
          </div>

          {/* services info */}
          <div className="w-full flex flex-col gap-8 lg:gap-10 2xl:gap-12">
            {(serviceData as TService[]).map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
