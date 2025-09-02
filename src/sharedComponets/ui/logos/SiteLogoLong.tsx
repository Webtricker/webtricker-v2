import { IMainHeader } from "@/types/componentsType";
import Image from "next/image";
type Props = {
  logos: IMainHeader["logo"];
};
export default async function SiteLogoLong({ logos }: Props) {
  return (
    <>
      <Image
        className="inline dark:hidden w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
        src={logos?.black || ""}
        width={282}
        height={74}
        alt="Site logo"
      />
      <Image
        className="hidden dark:inline w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
        src={logos?.white || ""}
        width={282}
        height={74}
        alt="Site logo"
      />
    </>
  );
}
