import { ArrowUpRightIcon } from "@/sharedComponets/ui/icons/Icons";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IService } from "@/types/post";
import { getSlicedText } from "@/utils/slicedText";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function ServicePanels({
  services = [],
}: {
  services: IService[];
}) {
  return (
    <>
      {services?.map((item: IService, index: number) => {
        const subServices = item.subServices ?? [];
        const thumbnail = item.thumnail ?? {
          url: "",
          width: 1000,
          height: 1000,
        };
        return (
          <section
            key={item._id}
            style={{ zIndex: services?.length + index }}
            className="service-panel !bg-slate-50 dark:!bg-slate-950 flex flex-col sm:flex-row w-full mt-20 md:mt-0  md:min-h-screen"
          >
            <div className="w-full sm:w-3/6 h-5/12 sm:h-full">
              <Image
                className="w-full h-full object-cover"
                src={thumbnail.url}
                width={thumbnail.width || 1000}
                height={thumbnail.height || 1000}
                alt={item.title}
                priority={index === 0}
              />
            </div>
            <div className="w-full sm:w-3/6 h-7/12 sm:h-full xl:px-10 2xl:px-20 pt-10">
              <Container className="h-full flex flex-col md:justify-center">
                <PanelHeader index={index} />
                <h4 className="mb-2 md:mb-4 lg:mb-6">{item.category}</h4>
                <div className="w-full flex flex-col items-start xl:ml-10 2xl:ml-12">
                  <p className="hidden lg:block ">{item.excerpt}</p>
                  <p className="lg:hidden">
                    {getSlicedText(item.excerpt || "", 300)}
                  </p>
                  {subServices?.length > 0 && (
                    <ul className="my-2 lg:flex md:my-4 lg:my-6 list-disc list-inside hidden flex-col md:gap-2">
                      {item.subServices.map((work, i) => (
                        <li key={work + i}>{work}</li>
                      ))}
                    </ul>
                  )}

                  {subServices?.length > 0 ? (
                    <ul className="my-2 flex lg:hidden md:my-4 lg:my-6 list-disc list-inside flex-col md:gap-2">
                      {item.subServices.slice(0, 5).map((work, i) => (
                        <li key={work + (i + 5)}>{work}</li>
                      ))}
                    </ul>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="w-full flex items-center justify-between mt-1 md:mt-4">
                  <Link
                    href={`/services/${item.slug}`}
                    className="duration-200 text-[#aa013f] underline flex items-center gap-1"
                  >
                    Want to know more about {item.category}?{" "}
                    <ArrowUpRightIcon />
                  </Link>
                </div>
              </Container>
            </div>
          </section>
        );
      })}
    </>
  );
}

function PanelHeader({ index }: { index: number }) {
  const num = index + 1;
  return (
    <p className="w-full flex items-center gap-1 mb-2 md:mb-3">
      <span>{num > 9 ? num : `0${num}`}</span>
      <span className="w-10 h-[0.1px] bg-slate-300"></span>
      <span>Creative Digital Studio</span>
    </p>
  );
}
