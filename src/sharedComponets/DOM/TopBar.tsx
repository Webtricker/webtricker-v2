import Container from "../ui/wrapper/Container";
import Image from "next/image";
import Link from "next/link";
import { ITopHeader } from "@/types/componentsType";

function TopBar({ info }: { info: ITopHeader }) {
  return (
    <section className="!bg-black -mt-4 py-2 mb-2 hidden md:block">
      <Container>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-white">
            {info?.contactLinks?.map((link) => {
              const emailOrNumber = link.text.includes("@")
                ? `mailto:${link.text}`
                : `tel:${link.text}`;

              return (
                <div key={link.text} className="flex items-center gap-2">
                  <Image
                    src={link.icon}
                    alt={link.text}
                    width={20}
                    height={20}
                  />
                  <a href={emailOrNumber}>{link.text}</a>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-white">
            {info?.socialLinks?.map((link) => {
              return (
                <Link key={link.href + link.icon} href={link.href}>
                  <Image
                    src={link.icon}
                    width={20}
                    height={20}
                    alt={link.href}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default TopBar;
