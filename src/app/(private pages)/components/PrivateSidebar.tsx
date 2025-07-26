"use client";
import {
  SET_EXPAND,
  updatePreventScrolling,
} from "@/redux/features/rootModyfier/Modyfier";
import { RootState } from "@/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SiteLogo from "@/sharedComponets/ui/header/SiteLogo";
import Link from "next/link";
import { settingsLinks } from "@/data/navLinks";
import { usePathname, useRouter } from "next/navigation";
import { XMarkIcon } from "@/sharedComponets/ui/icons/Icons";
import Button from "@/sharedComponets/ui/buttons/Button";
import { removeAccessToken } from "@/utils/auth";
import { toast } from "react-toastify";


type Props = {
  navStyle?: string;
  children?: React.ReactNode;
};
export default function PrivateSidebar({children=<></>}:Props) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const EXPAND = useSelector((state: RootState) => state.modyfier.EXPAND);

  //   hanlders
  const handleClose = () => {
    dispatch(SET_EXPAND(null));
    dispatch(updatePreventScrolling(false));
  };

  const handleLogout = async () => {
    // clear cookies and redirect to home page
    try {
      const res = await fetch("/api/auth/logout");
      const result = await res.json();
      if (result.success) {
        removeAccessToken();
        router.replace("/");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      toast.warn("Something went wrong")
      console.log(error);
    }
  };

  const active = EXPAND === "OPEN_PRIVATE_SIDEBAR_MENU";
  return (
    <aside
      className={`w-full bg-slate-200 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 max-w-[400px] lg:max-w-[350px] overflow-hidden h-screen fixed lg:sticky top-0 
        ${
          active ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } duration-500 z-[999]`}
    >
      <div className="w-full flex flex-col h-full">
        <div className="w-full py-2 px-5 flex items-center justify-between">
          <SiteLogo>
            {children}
          </SiteLogo>
          <button className="lg:hidden" onClick={handleClose}>
            <XMarkIcon />
          </button>
        </div>
        <div className="w-full flex flex-col items-start mt-2 grow border-t border-slate-300 dark:border-slate-700">
          {settingsLinks.map((link) => (
            <Link
              key={link.href}
              className={`duration-200 px-5 py-2 w-full ${
                pathname === link.href
                  ? "bg-slate-300/60 dark:bg-slate-700/40 shadow"
                  : "hover:bg-slate-300/40  dark:hover:bg-slate-700/60"
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-full grow flex items-center justify-center pr-5 border-t border-slate-300 dark:border-slate-700">
            <Button label="Logout" className="!py-2.5" cb={handleLogout} />
          </div>
        </div>
      </div>
    </aside>
  );
}
