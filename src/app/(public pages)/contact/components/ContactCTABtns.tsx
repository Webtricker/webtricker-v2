import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function ContactCTABtns({ sidePanelData }) {
  return (
    <div className="hidden lg:flex absolute top-[50%] rotate-90 left-0 translate-x-[-45%] xl:translate-x-[-30%] items-center gap-5">
      <div className="flex gap-5">
        {sidePanelData?.socialLinks?.map(
          (link: { icon: string; href: string }, indx) => (
            <Link href={link?.href} target="_blank" key={link?.href + indx}>
              <Image
                src={link.icon}
                width={16}
                height={16}
                alt={link.href}
                className="w-4 h-4 -rotate-90"
              />
            </Link>
          )
        )}
      </div>
      <span className="w-20 h-[1px] bg-black dark:bg-white"></span>
      <p className="wt_fs-sm whitespace-nowrap">{sidePanelData?.text}</p>
    </div>
  );
}
