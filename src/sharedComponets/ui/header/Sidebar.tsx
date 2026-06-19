"use client";
import {
  SET_EXPAND,
  updatePreventScrolling,
} from "@/redux/features/rootModyfier/Modyfier";
import { RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "../icons/Icons";
import Image from "next/image";
import Link from "next/link";
import SidebarImages from "./SidebarImages";
import { IMainHeader, ISidebar } from "@/types/componentsType";
import { usePathname } from "next/navigation";
// import SocialLinks from "../footer/SocialLinks";

type Props = {
  sidebarData: ISidebar;
  navlinks: IMainHeader["links"];
  siteConfigData: SiteConfig | null;
};

type SiteConfig = {
  contact?: {
    phones?: string[];
    emails?: string[];
  };
  offices?: {
    label: string;
    addressText: string;
  }[];
  socialLinks?: {
    platform: string;
    href: string;
    isExternal: boolean;
  }[];
};

const socialIcons: Record<string, string> = {
  facebook:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394774/bpcdltvbsjzlht4vjwxa.svg",
  x: "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/bjzfmm45zgjhpyzrlth3.svg",
  linkedin:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394772/jml2zlqdmneozvp51u8k.svg",
  pinterest:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/p70y0hwlyepiaog0mkwd.svg",
  instagram:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/fzxc3um5pqkfdj2h78zh.svg",
  youtube:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/hudakq7c0esdgepdk1xb.svg",
};

export default function Sidebar({ navlinks, sidebarData, siteConfigData }: Props) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const EXPAND = useSelector((state: RootState) => state.modyfier.EXPAND);

  //   hanlders
  const handleClose = () => {
    dispatch(SET_EXPAND(null));
    dispatch(updatePreventScrolling(false));
  };

  const active = EXPAND === "OPEN_SIDEBAR_MENU";
  const phones = siteConfigData?.contact?.phones ?? [];
  const emails = siteConfigData?.contact?.emails ?? [];
  const offices = siteConfigData?.offices ?? [];
  const links = siteConfigData?.socialLinks ?? [];

  return (
    <div
      data-prevent-body-trigger
      className={`z-[999] flex duration-500 justify-end w-screen h-screen overflow-hidden fixed top-0 right-0 ${active ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        onClick={handleClose}
        className={`w-full absolute top-0 left-0 duration-1000 bg-slate-900/60 h-full opacity-0 ${active ? "!opacity-100" : ""
          }`}
      ></div>

      {/* sidebar links and social info */}
      <div
        className={`wt_sitebar-container duration-500 flex flex-col py-4 w-full  sm:max-w-[450px] h-full relative ${active ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="w-full pb-5 flex items-center justify-between px-4 md:px-5  lg:px-8 xl:px-9">
          <Link href="/">
            <Image
              className="inline w-14"
              onClick={handleClose}
              src={sidebarData?.shortLogo || ""}
              width={50}
              height={50}
              alt="Site logo small"
            />
          </Link>
          <button
            onClick={handleClose}
            aria-label="Sidebar closer"
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
          {/* links */}
          <div className="lg:hidden inline-flex w-full flex-col items-center mt-10 lg:mt-20 gap-5">
            <Link
              className={`uppercase cursor-pointer ${pathname === "/" && "wt_active-navlink"}`}
              key="home_link"
              href="/"
              onClick={handleClose}
            >
              Home
            </Link>
            {navlinks?.map(({ isExternal, href, label }) => (
              <Link
                className={`uppercase cursor-pointer ${pathname === href && "wt_active-navlink"}`}
                key={label}
                href={href}
                target={isExternal ? "_blank" : "_self"}

                onClick={handleClose}
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
            <h6 className="heading uppercase mb-1">{sidebarData?.information?.title || ""}</h6>
            <p>
              {
                phones.map(phone => <a key={phone} target="_blank" href={`tel:${phone}`} className="block animate-underline">
                  {phone}
                </a>)
              }
            </p>

            <p className="flex flex-col gap-1 mt-5">
              {
                emails.map(mail => <a key={mail} target="_blank" href={`mailto:${mail}`} className="block animate-underline">
                  {mail}
                </a>)
              }
            </p>

            {
              offices.map(office => <p key={office.addressText} className="">
                <strong>{office.label}</strong>: {office.addressText}
              </p>)
            }
          </div>

          {/* social links */}
          <div className="w-full flex flex-col  gap-3 mt-14 lg:mt-20">
            <h6 className="heading uppercase mb-2 text-center lg:text-start">
              {sidebarData?.socialLinks?.title || ""}
            </h6>
            <div className="w-full flex gap-5 lg:gap-6 xl:gap-7 flex-wrap items-center justify-center">
              {
                links.map(link => {
                  const icon = socialIcons[link.platform];
                  if (!icon) return null;

                  return (
                    <Link key={link.href} target={link?.isExternal ? "_blank" : "_self"} href={link.href}>
                      <Image src={icon} width={26} height={26} alt="Social icon" />
                    </Link>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
