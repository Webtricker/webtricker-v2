"use client"
import Image from "next/image";

import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function SidebarLogo() {
   const { isLoading, darkLargeLogo, lightLargeLogo } = useSelector(
    (state: RootState) => state.siteLogo
  );

  if(isLoading) return <LoadingSpinner />

  return (
    <>
      <Image
        className="inline dark:hidden w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
        src={darkLargeLogo}
        width={282}
        height={74}
        alt="Site logo"
      />
      <Image
        className="hidden dark:inline w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
        src={lightLargeLogo}
        width={282}
        height={74}
        alt="Site logo"
      />
    </>
  );
}

