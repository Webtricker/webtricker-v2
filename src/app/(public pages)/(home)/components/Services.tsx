import galleryModern from "@/app/fonts/gallery";
import LinkButton from "@/sharedComponets/ui/buttons/LinkButton";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { getServicesData } from "@/utils/pageData";
import React from "react";
import ServiceCard from "./ServieCard";
import { IService } from "@/types/post";
import ServiceButtons from "./ServiceButtons";

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
  const serviceData = await getServicesData();
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <Container>
        <div className="w-full flex-col md:flex-row gap-10 sm:gap-16 md:gap-10 flex justify-between">
          <div>
            <div className="sticky top-40">
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
              <ServiceButtons serviceData={serviceData} />
              <LinkButton
                className="mt-5 w-full text-center"
                label={allServiceTxt || "See All Services"}
                href="/services"
              />
            </div>
          </div>
          {/* services info */}
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 md:max-w-[800px]">
            {(serviceData as IService[]).map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
