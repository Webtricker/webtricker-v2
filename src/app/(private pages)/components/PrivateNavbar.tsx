"use client"
import SiteLogo from "@/sharedComponets/ui/header/SiteLogo";
import React from "react";
import { useDispatch } from "react-redux";
import {
  SET_EXPAND,
  updatePreventScrolling,
} from "@/redux/features/rootModyfier/Modyfier";
import { HambergerMenuIcon } from "./Icons";

type Props = {
  navStyle?: string;
  children?: React.ReactNode;
};

export default function PrivateNavbar({children=<></>}:Props) {
  const dispatch = useDispatch();
  // handlers
  const handleClick = () => {
    dispatch(SET_EXPAND("OPEN_PRIVATE_SIDEBAR_MENU"));
    dispatch(updatePreventScrolling(true));
  };
  return (
    <div className="w-full  wt_header py-2 flex justify-between items-center px-4 md:px-5 lg:hidden fixed top-0 left-0 z-[99]">
      <SiteLogo>{children}</SiteLogo>
      <button onClick={handleClick}>
        <HambergerMenuIcon className="w-10 h-6" />
      </button>
    </div>
  );
}

