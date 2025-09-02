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
          <div className="border p-4 flex flex-col gap-2 items-center max-w-[300px] rounded-2xl min-h-[320px] border-green-600">
            <Image
              className="w-[200px] h-[200px] rounded-full"
              src={item?.profile}
              alt={item?.name}
              width={200}
              height={200}
            />
            <div className="text-center">
              <h6 className="font-bold">{item.name}</h6>
              <p className="italic">{item.role}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
