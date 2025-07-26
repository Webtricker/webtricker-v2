import Image from "next/image";
import webtrickerDark from "@/assets/images/home/webtricker-logo.svg";
import webtrickerWhite from "@/assets/images/home/webtricker-white.svg";
import { getSiteLogos } from "@/utils/logo";

export default async function SiteLogoLong() {
  let logoUrls = { darkLargeLogo: null, lightLargeLogo: null };
  try {
    const result = await getSiteLogos();
    if (result) {
      logoUrls = {
        darkLargeLogo: result.darkLargeLogo,
        lightLargeLogo: result.lightLargeLogo,
      };
    }
  } catch (error) {
    console.error("Error fetching site logos:", error);
  }

  const finalDarkLogoSrc = logoUrls.darkLargeLogo || webtrickerDark;
  const finalLightLogoSrc = logoUrls.lightLargeLogo || webtrickerWhite;

  return (
    <>
      <Image
        className="inline dark:hidden w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
        src={finalDarkLogoSrc}
        width={282}
        height={74}
        alt="Site logo"
      />
      <Image
        className="hidden dark:inline w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
        src={finalLightLogoSrc}
        width={282}
        height={74}
        alt="Site logo"
      />
    </>
  );
}
