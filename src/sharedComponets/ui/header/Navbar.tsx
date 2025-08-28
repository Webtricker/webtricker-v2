"use client";
import React, { useEffect, useRef, useState } from "react";
import Container from "@/sharedComponets/ui/wrapper/Container";
import Link from "next/link";
import Sidebar from "./Sidebar";
import SiteLogo from "./SiteLogo";
import SidebarToggler from "./SidebarToggler";
import { getLenisInstance } from "@/utils/lenis";
import { navLinks } from "@/data/navLinks";
import { StaticImageData } from "next/image";
import TopBar from "@/sharedComponets/DOM/TopBar";
import { ITopBarInfo } from "@/types/data";

type Props = {
  navStyle?: string;
  children?: React.ReactNode;
  siteShortLogoUrl: string | StaticImageData;
  topBarInfo: ITopBarInfo;
};

export default function Navbar({
  navStyle = "",
  children = <></>,
  siteShortLogoUrl,
  topBarInfo,
}: Props) {
  // variables
  const THRESHOLD = 150;

  // hooks
  const [scrollY, setScrollY] = useState(0);
  const [showBorder, setShowBorder] = useState(false);
  const prevScrollRef = useRef(0);

  useEffect(() => {
    const lenis = getLenisInstance();
    if (!lenis) return;

    const handleScroll = () => {
      const currentScroll = lenis.scroll;
      const prevScroll = prevScrollRef.current;

      // set the border
      if (prevScrollRef.current > 50 && !showBorder) {
        setShowBorder(true);
      } else {
        setShowBorder(false);
      }

      const isScrollingDown = currentScroll > prevScroll;
      const isScrollingUp = currentScroll < prevScroll;

      // Scrolling down — hide header
      if (isScrollingDown) {
        if (currentScroll < THRESHOLD) {
          setScrollY(currentScroll);
        }

        if (currentScroll > THRESHOLD && scrollY !== 0) {
          setScrollY(0);
        }
      }

      // Scrolling up and scrollY is greater than 0, reduce scrollY gradually
      if (isScrollingUp && currentScroll < THRESHOLD && scrollY > 0) {
        const distanceToTop = Math.max(currentScroll, 0);
        const newScrollY = Math.max(0, Math.min(THRESHOLD, distanceToTop));
        setScrollY(newScrollY);
      }

      prevScrollRef.current = currentScroll;
    };

    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [scrollY, showBorder]);
  return (
    <header
      style={{ transform: `translateY(-${scrollY}px)` }}
      className={`z-[999] wt_header fixed top-0 left-0 py-4 w-full h-auto ${navStyle} ${
        scrollY === 0 ? "duration-1000" : ""
      } ${showBorder ? "shadow" : "border-0"}`}
    >
      <TopBar info={topBarInfo} />
      <Container>
        <div className="w-full flex items-center justify-center">
          <SiteLogo>{children}</SiteLogo>

          {/* links */}
          <div className="hidden mt-[8px] lg:inline-flex items-center gap-5 md:gap-6 lg:gap-7 xl:gap-8 2xl:gap-10">
            {navLinks.map(({ href, label }) => (
              <Link
                className="wt_header-navlink heading uppercase cursor-pointer"
                key={label}
                href={href}
              >
                {label}
              </Link>
            ))}
          </div>

          <SidebarToggler />
        </div>
      </Container>

      <Sidebar siteShortLogoUrl={siteShortLogoUrl} key="PUBLIC_SIDEBAR" />
    </header>
  );
}
