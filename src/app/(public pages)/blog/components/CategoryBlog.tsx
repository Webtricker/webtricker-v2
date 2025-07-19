"use client";
import Button from "@/sharedComponets/ui/buttons/Button";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TCategory } from "@/types/data";
import { formatDateToShortString } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CategoryBlog({ category }: { category: TCategory }) {
  return (
    <Container className="section-speacing">
      <div className="w-full flex items-center justify-between gap-4 flex-wrap lg:gap-10">
        <h4>{category.name}</h4>
        <Link href={`/category/${category._id}`}>
          <Button label="Show All" className="!py-2.5 lg:!py-3" />
        </Link>
      </div>
      <div className="w-full mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
        {new Array(8).fill(null).map((_, _i) => (
          <div
            key={_i}
            className="duration-200 flex flex-col lg:duration-500 lg:hover:scale-[1.02] overflow-hidden w-full rounded-[10px] border border-slate-300 hover:border-slate-400 dark:border-slate-600 min-h-[500px]"
          >
            <div className="w-full h-[230px]">
              <Image
                src="https://res.cloudinary.com/dirjayri8/image/upload/v1752076651/oxy6ze1dgrtk3uzva9i5.jpg"
                width={300}
                className="w-full h-full object-cover"
                height={230}
                alt="Blog image"
              />
            </div>
            <div className="w-full  p-4 flex flex-col grow">
              <h6>
                {/* {trimText(text, 52)} */}
                Web development & Seo Friendly content and more{" "}
              </h6>
              <p className="mt-2">
                {/* {trimText(text, 133)} */}
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
                eaque explicabo accusamus quod omnis natus. incl
              </p>
              <div className="w-full flex items-end grow">
                <div className="w-full flex items-center justify-between">
                  <p>{formatDateToShortString(new Date())}</p>
                  <Link href={`/blogs/slug`}>
                    <Button label="Read More" className="!text-sm !py-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
