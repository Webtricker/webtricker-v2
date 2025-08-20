import galleryModern from "@/app/fonts/gallery";
import LinkButton from "@/sharedComponets/ui/buttons/LinkButton";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TService } from "@/types/data";
import { getServicesData } from "@/utils/pageData";
import Image from "next/image";
import React from "react";

export const ServiceCard = ({ service }: { service: TService }) => {
  return (
    <div className="flex items-center gap-5 md:gap-6 lg:gap-8 2xl:gap-10">
      <Image
        width={40}
        height={40}
        className="h-auto"
        alt="Service icon"
        src={service.icon || ""}
      />
      <div className="grow">
        <h6 className="heading font-semibold uppercase">{service.title}</h6>
        <p>{service.excerpt}</p>
      </div>
    </div>
  );
};

// ====== root component ======
type PageProps = {
  serviceSectionTitle: {
    large: string;
    medium: string;
    small: string;
  };
  allServiceTxt: string;
};
export default async function Services({
  serviceSectionTitle,
  allServiceTxt,
}: PageProps) {
  const serviceData = await getServicesData(4);
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <Container>
        <div className="w-full flex-col md:flex-row gap-10 sm:gap-16 md:gap-10 flex justify-between">
          <div className="w-full">
            <h2 className="heading inline !leading-[100%]">
              {serviceSectionTitle?.large || "Thoughtful"}
            </h2>
            <div className="w-full flex flex-wrap lg:flex-nowrap items-end gap-2">
              <h2
                className={`heading !leading-[100%] ${galleryModern.className}`}
              >
                {serviceSectionTitle?.medium || "Process"}
              </h2>
              <h6 className="mb-2 md:mb-4 heading">
                {serviceSectionTitle?.small || "We Think a lot"}
              </h6>
            </div>
            <LinkButton
              className="mt-5"
              label={allServiceTxt || "See All Services"}
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
