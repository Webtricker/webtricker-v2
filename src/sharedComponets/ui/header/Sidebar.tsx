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
// import SocialLinks from "../footer/SocialLinks";

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
              <a href="tel:+8809639237100" className="block animate-underline">
                +8809639237100
              </a>
              <a href="tel:+8809639237101" className="block animate-underline">
                +8809639237101
              </a>
              <a href="tel:+16824726184" className="block animate-underline">
                +1 (682) 472-6184
              </a>
              <a href="tel:+8801712377577" className="block animate-underline">
                +8801712377577
              </a>
              <a href="tel+8801785696469:" className="block animate-underline">
                +8801785696469
              </a>
              <a href="tel:+8801793544335" className="block animate-underline">
                +8801793544335
              </a>
            </p>

            <p className="flex flex-col gap-1">
              <Link
                title="Email"
                href="mailto:info@webtricker.com"
                className="animate-underline"
              >
                info@webtricker.com
              </Link>
              <Link
                title="Email"
                href="mailto:inquiry@webtricker.com"
                className="animate-underline"
              >
                inquiry@webtricker.com
              </Link>
              <Link
                title="Email"
                href="mailto:career@webtricker.com"
                className="animate-underline"
              >
                career@webtricker.com
              </Link>
              <Link
                title="Email"
                href="mailto:admin@webtricker.com"
                className="animate-underline"
              >
                admin@webtricker.com
              </Link>
            </p>

            <p>
              House No. 46, Zia College More, beside Shahid Minar, Jamalpur,
              Bangladesh.
            </p>
          </div>

          {/* social links */}
          <div className="w-full flex flex-col  gap-3 mt-14 lg:mt-20">
            <h6 className="heading uppercase mb-2 text-center lg:text-start">
              FOLLOW US
            </h6>
            <div className="w-full flex gap-5 lg:gap-6 xl:gap-7 flex-wrap">
              {/* ====== TODO: ========= */}
              {/* <SocialLinks /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
