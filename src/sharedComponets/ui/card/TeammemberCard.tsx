import { TOurLeader } from "@/types/data";
import Image from "next/image";
import Link from "next/link";

export default function TeammemberCard({ team }: { team: TOurLeader }) {
  return (
    <div className="shadow-effect-large p-10 rounded-[8px] min-w-[280px]">
      <div className="w-[200px] lg:w-[250px] h-[200px] lg:h-[250px] overflow-hidden rounded-full">
          <Image className="w-full h-full rounded-full object-cover" src={team.image} width={180} height={180} alt={team.name} />
      </div>
      <div className="mt-5 text-center">
        <h6 className="mb-1">{team.name}</h6>
        <span>{team.description}</span>
          <ul className="flex items-center justify-center gap-5 mt-5">
            {team.socialLinks.map((socialLink) => (
              <li key={socialLink.url}>
                <Link href={socialLink.url} target="_blank" rel="noreferrer">
                  <Image
                    src={socialLink.icon}
                    width={32}
                    height={32}
                    alt={socialLink.alt}
                  />
                </Link>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
}
