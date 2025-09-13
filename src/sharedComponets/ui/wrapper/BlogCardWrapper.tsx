"use client";
import { trimText } from "@/utils/blog";
import { formatDateToShortString } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  thumnail: string;
  title: string;
  excerpt?: string;
  description: string;
  slug: string;
  createdAt: string;
};
export default function BlogCardWrapper({
  thumnail,
  createdAt,
  title,
  excerpt = "",
  description,
  children,
  slug,
}: Props) {
  const isDashboard = usePathname()?.includes("settings");
  return (
    <Link
      href={isDashboard ? `/settings/blogs/${slug}` : `/blog/${slug}`}
      className="relative duration-200 flex flex-col lg:duration-500 lg:hover:scale-[1.02] overflow-hidden w-full rounded-[10px] border border-slate-300 hover:border-slate-400 dark:border-slate-600 min-h-[500px] lg:hover:shadow-xl shadow-md"
    >
      <div className="w-full h-[230px]">
        <Image
          src={thumnail}
          width={300}
          className="w-full h-full object-cover"
          height={230}
          alt={title}
        />
      </div>
      <div className="w-full  p-4 flex flex-col grow">
        <h6>{trimText(title, 52)}</h6>
        <p className="mt-2">{trimText(excerpt ? excerpt : description, 133)}</p>
        <div className="w-full flex items-end grow">
          <div className="w-full flex items-center justify-between">
            <p>{formatDateToShortString(createdAt)}</p>
            {children}
          </div>
        </div>
      </div>
    </Link>
  );
}

{
  /* 
  <Link href={`/blogs/slug`}>
      <Button label="Read More" className="!text-sm !py-2.5" />
  </Link>
                  
 add this to the children */
}
