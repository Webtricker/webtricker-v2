"use client";
import React, { useEffect, useRef } from "react";
import { getLenisInstance } from "@/utils/lenis";

type Props = {
  navStyle?: string;
  children?: React.ReactNode;
};

export default function Navbar({ navStyle = "", children = <></> }: Props) {
  const THRESHOLD = 150;
  const headerRef = useRef<HTMLElement>(null);
  const scrollYRef = useRef(0);
  const prevScrollRef = useRef(0);

  useEffect(() => {
    const lenis = getLenisInstance();
    if (!lenis) return;

    const handleScroll = () => {
      const currentScroll = lenis.scroll;
      const prevScroll = prevScrollRef.current;
      const header = headerRef.current;
      if (!header) return;

      const isScrollingDown = currentScroll > prevScroll;
      const isScrollingUp = currentScroll < prevScroll;
      let newScrollY = scrollYRef.current;

      // Scrolling down — hide header (or adjust based on threshold)
      if (isScrollingDown) {
        if (currentScroll < THRESHOLD) {
          newScrollY = currentScroll;
        }

        if (currentScroll > THRESHOLD && newScrollY !== 0) {
          newScrollY = 0;
        }
      }

      // Scrolling up and scrollY is greater than 0, reduce scrollY gradually
      if (isScrollingUp && currentScroll < THRESHOLD && newScrollY > 0) {
        const distanceToTop = Math.max(currentScroll, 0);
        newScrollY = Math.max(0, Math.min(THRESHOLD, distanceToTop));
      }

      if (scrollYRef.current !== newScrollY) {
        scrollYRef.current = newScrollY;
        header.style.transform = `translateY(-${newScrollY}px)`;
        if (newScrollY === 0) {
          header.classList.add("duration-1000");
        } else {
          header.classList.remove("duration-1000");
        }
      }

      prevScrollRef.current = currentScroll;
    };

    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`z-[999] wt_header fixed top-0 left-0 py-1 md:py-2 lg:py-4 w-full h-auto shadow dark:shadow-slate-700 border-b border-gray-200 dark:border-gray-800 transition-transform ${navStyle}`}
    >
      {children}
    </header>
  );
}
