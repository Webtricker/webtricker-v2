import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import React from "react";

type Props = {
  whatWeOfferTitle: string;
  whatWeOfferSubtitle: string;
  whatWeOfferCurveIconWhite: string;
  whatWeOfferCurveIconBlack: string;
  whatWeOfferItems: string[];
};
export default function WhatWeDo(props: Props) {
  return (
    <section className="pt-8 md:pt-10 lg:pt-14 xl:pt-16 2xl:pt-18">
      <Container className="flex flex-col lg:hidden mb-4">
        <h5 className="heading">{props?.whatWeOfferTitle}</h5>
        <p className="bold whitespace-nowrap">{props?.whatWeOfferSubtitle}</p>
      </Container>
      <Container className="flex flex-col sm:flex-row lg:grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] justify-between gap-5 !max-w-[1050px] xl:gap-6 2xl:gap-10 mx-auto">
        <div className="w-full hidden lg:block">
          <h5 className="heading">{props?.whatWeOfferTitle}</h5>
          <div className="w-full flex items-start mt-2">
            {" "}
            <p className="bold whitespace-nowrap">
              {props?.whatWeOfferSubtitle}
            </p>
            <div className="hidden sm:block w-full mt-4">
              <Image
                className="w-16 md:w-16 h-auto  dark:hidden"
                src={props?.whatWeOfferCurveIconWhite || ""}
                width={70}
                height={100}
                alt="Line svg"
              />
              <Image
                className="w-16 md:w-16 h-auto hidden dark:inline-block"
                src={props?.whatWeOfferCurveIconBlack || ""}
                width={70}
                height={100}
                alt="Line svg"
              />
            </div>
          </div>
        </div>
        <WhatWeOfferItems items={props.whatWeOfferItems || []} />
      </Container>
    </section>
  );
}

const WhatWeOfferItems = ({ items }: { items: string[] }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const midpoint = Math.ceil(items.length / 2);
  const firstHalf = items.slice(0, midpoint);
  const secondHalf = items.slice(midpoint);

  return (
    <>
      <ul className="list-disc list-inside lg:list-outside flex flex-col gap-2 w-full">
        {firstHalf.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <ul className="list-disc list-inside lg:list-outside flex flex-col gap-2 w-full">
        {secondHalf.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  );
};
