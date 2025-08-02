"use client";
import {
  SET_EXPAND,
  updatePreventScrolling,
} from "@/redux/features/rootModyfier/Modyfier";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "../icons/Icons";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { navLinks } from "@/data/navLinks";
import SidebarImages from "./SidebarImages";

type Props = {
  siteShortLogoUrl: string | StaticImageData;
};
export default function Sidebar({ siteShortLogoUrl }: Props) {
  const dispatch = useDispatch();
  const EXPAND = useSelector((state: RootState) => state.modyfier.EXPAND);

  //   hanlders
  const handleClose = () => {
    dispatch(SET_EXPAND(null));
    dispatch(updatePreventScrolling(false));
  };

  useEffect(() => {}, []);
  const active = EXPAND === "OPEN_SIDEBAR_MENU";
  return (
    <div
      data-prevent-body-trigger
      className={`z-[999] flex duration-500 justify-end w-screen h-screen overflow-hidden fixed top-0 right-0 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={handleClose}
        className={`w-full absolute top-0 left-0 duration-1000 bg-slate-900/60 h-full opacity-0 ${
          active ? "!opacity-100" : ""
        }`}
      ></div>

      {/* sidebar links and social info */}
      <div
        className={`wt_sitebar-container duration-500 flex flex-col py-4 w-full  sm:max-w-[450px] h-full relative ${
          active ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-full pb-5 flex items-center justify-between px-4 md:px-5  lg:px-8 xl:px-9">
          <Link href="/">
            <Image
              className="inline w-14"
              onClick={handleClose}
              src={siteShortLogoUrl}
              width={50}
              height={50}
              alt="Site logo small"
            />
          </Link>
          <button
            onClick={handleClose}
            className="duration-300 hover:rotate-90 text-black dark:text-white"
          >
            <XMarkIcon />
          </button>
        </div>

        {/* content */}
        <div
          data-lenis-prevent
          className="sidebar_scrollable_container grow w-full overflow-y-auto px-4 md:px-5 lg:px-8 xl:px-9"
        >
          <div className="w-full mt-5 lg:mt-16">
            <h5 className="heading font-semibold text-center lg:text-start">
              Your Digital Partner for Success
            </h5>
            <p className="mt-2 text-center lg:text-start">
              {/* Ready to grow your business? We&apos;re a full-service digital agency that acts as your dedicated partner, not just a service provider. From planning and design to development, debugging, and marketing, we handle all your digital needs. Our expertise in SEO development ensures your brand gets the visibility it deserves. */}
              Looking for a digital partner? We&apos;re a full-service agency
              providing planning, design, development, debugging, and SEO.
              Let&apos;s collaborate to grow your business and achieve success.
            </p>
          </div>

          {/* links */}
          <div className="lg:hidden inline-flex w-full flex-col items-center mt-10 lg:mt-20 gap-5">
            {navLinks.map(({ href, label }) => (
              <Link
                className="uppercase cursor-pointer"
                key={label}
                href={href}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="w-full hidden lg:block">
            <SidebarImages />
          </div>

          {/* company information */}
          <div className="w-full flex flex-col items-center lg:items-start gap-3 mt-10 lg:mt-20">
            <h6 className="heading uppercase mb-1">INFORMATION</h6>
            <p>
              <a href="tel:+442077001007">+4 20 7700 1007</a>
            </p>

            <p>
              <a href="mailto:hello@diego.com">hello@diego.com</a>
            </p>

            <p>Avenue de Roma 158b, Lisboa</p>
          </div>

          {/* social links */}
          <div className="w-full flex flex-col  gap-3 mt-14 lg:mt-20">
            <h6 className="heading uppercase mb-1 text-center lg:text-start">
              FOLLOW US
            </h6>
            <div className="w-full flex gap-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
