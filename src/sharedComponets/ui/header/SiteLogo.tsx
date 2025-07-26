"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getLenisInstance } from "@/utils/lenis";


type Props = {
className?: string;
children?:string;
}

export default function SiteLogo({ className = "",children=<></> }: Props) {
  // variables
  const THRESHOLD = 270;

  // hooks
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const lenis = getLenisInstance();
    if (!lenis) return;

    const handleScroll = () => {
      const scrollY = lenis.scroll;
      if (scrollY > THRESHOLD && !expand) {
        setExpand(true);
      }

      if (scrollY < THRESHOLD && expand) {
        setExpand(false);
      }
    };

    // Lenis uses a custom RAF loop, so hook into its scroll event
    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [expand]);

  const expandStyle = expand
    ? "!max-w-[400px] lg:!max-w-[550px]"
    : "max-w-[300px]";

  return (
    <Link
      href="/"
      className={`flex items-center gap-1 bold duration-1000 w-full ${expandStyle} ${
        className ? className : ""
      }`}
    >
      {children}
    </Link>
  );
}
