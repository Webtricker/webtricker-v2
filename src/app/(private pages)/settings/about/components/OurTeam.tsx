"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { ITeamInfo } from "@/types/data";
import Link from "next/link";

export default function OurTeam({ teamData }: { teamData: ITeamInfo[] }) {
  if (!teamData.length)
    return (
      <div className="flex items-center justify-center w-full py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <h5>Please add team information from dashboard</h5>
      </div>
    );

  return (
    <div className="w-full flex flex-wrap justify-center gap-4">
      {teamData.map((item) => (
        <Link href={`/settings/teams/${item._id}`} key={item.name}>
          <div className="p-4 flex flex-col gap-6 items-center max-w-[350px] min-h-[450px] justify-center rounded-[8px] dark:shadow dark:shadow-white dark:hover:shadow-md dark:hover:shadow-slate-600 duration-300 shadow-md shadow-slate-300 hover:shadow dark:hover:border-t dark:hover:border-t-slate-600">
            <Image
              className="w-[250px] h-[250px] rounded-full"
              src={item?.profile}
              alt={item?.name}
              width={200}
              height={200}
            />
            <div className="text-center">
              <h6 className="font-bold">{item.name}</h6>
              <p>{item.role}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
