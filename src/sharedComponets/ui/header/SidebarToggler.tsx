"use client";
import {
  SET_EXPAND,
  updatePreventScrolling,
} from "@/redux/features/rootModyfier/Modyfier";
import DemoThemeToggler from "@/tests/DemoThemeToggler";
import { getLenisInstance } from "@/utils/lenis";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function SidebarToggler() {
  // variables
  const THRESHOLD = 270;

  // hooks
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(false);

  // handlers
  const handleClick = () => {
    dispatch(SET_EXPAND("OPEN_SIDEBAR_MENU"));
    dispatch(updatePreventScrolling(true));
  };

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
    : "max-w-[300px] lg:pr-[90px]";
  return (
    <div
      className={`w-full duration-1000 gap-3 flex items-center justify-end ${expandStyle}`}
    >
      <button
        onClick={handleClick}
        className="cursor-pointer wt_sidebar-toggler"
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
      </button>
      <DemoThemeToggler />
    </div>
  );
}
