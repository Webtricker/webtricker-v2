import { ILeaderInfo } from "@/types/data";
import Image from "next/image";
import Link from "next/link";

export default function TeammemberCard({ team }: { team: ILeaderInfo }) {
  return (
    <div className="shadow-effect-large p-10 rounded-[8px] w-full mx-0.5 sm:mx-0 sm:max-w-[330px]">
      <div className="w-[200px] lg:w-[250px] mx-auto h-[200px] lg:h-[250px] overflow-hidden rounded-full">
        <Image
          className="w-full h-full rounded-full object-cover"
          src={team?.profile}
          width={180}
          height={180}
          alt={team.name}
        />
      </div>
      <div className="mt-5 text-center">
        <h6 className="mb-1">{team?.name || ""}</h6>
        <span>{team?.role || ""}</span>
        <ul className="flex items-center justify-center gap-5 mt-5">
          <li>
            <Link
              href={team.facebookLink || ""}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/svgs/Facebook.svg"
                width={32}
                height={32}
                alt="Facebook icon"
              />
            </Link>
          </li>
          <li>
            <Link
              href={team.instagramLink || ""}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/svgs/instagram.svg"
                width={32}
                height={32}
                alt="Instagram icon"
              />
            </Link>
          </li>
          <li>
            <Link
              href={team.linkedInLink || ""}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/svgs/LinkedIn.svg"
                width={32}
                height={32}
                alt="LinkedIn icon"
              />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
