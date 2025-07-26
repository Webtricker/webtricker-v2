import Image from "next/image";
import webtrickerW from "@/assets/images/home/webtricker-w.png";
import { getSiteLogos } from "@/utils/logo";

export default async function SiteLogoShort() {
  let smallLogo: string | null = null;
  try {
    const result = await getSiteLogos();
    if (result) {
      smallLogo = result?.smallLogo || null;
    }
  } catch (error) {
    console.error("Error fetching site logos:", error);
  }

  const finalSmallLogo = smallLogo || webtrickerW;

  return (
    <Image
      className="inline w-14"
      src={finalSmallLogo}
      width={50}
      height={50}
      alt="Site logo small"
    />
  );
}
