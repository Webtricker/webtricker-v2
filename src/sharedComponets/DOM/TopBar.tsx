import Container from "../ui/wrapper/Container";
import Image from "next/image";
import Link from "next/link";

type SiteConfig = {
  contact?: {
    primaryPhone?: string;
    primaryEmail?: string;
  };
  socialLinks?: {
    platform: string;
    href: string;
    isExternal: boolean;
  }[];
};

const contactIcons = {
  phone: "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394666/aufn0jef1napo9ai56ua.svg",
  email: "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394666/g08mhjtr3sjzbdry99ot.svg",
};

const socialIcons: Record<string, string> = {
  facebook:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394774/bpcdltvbsjzlht4vjwxa.svg",
  linkedin:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394772/jml2zlqdmneozvp51u8k.svg",
  x: "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/bjzfmm45zgjhpyzrlth3.svg",
  pinterest:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/p70y0hwlyepiaog0mkwd.svg",
  youtube:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/hudakq7c0esdgepdk1xb.svg",
  instagram:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/fzxc3um5pqkfdj2h78zh.svg",
};

async function fetchSiteConfig(): Promise<SiteConfig | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/site-config`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

async function TopBar() {
  const siteConfig = await fetchSiteConfig();
  const contactLinks = [
    siteConfig?.contact?.primaryPhone && {
      icon: contactIcons.phone,
      text: siteConfig.contact.primaryPhone,
    },
    siteConfig?.contact?.primaryEmail && {
      icon: contactIcons.email,
      text: siteConfig.contact.primaryEmail,
    },
  ].filter((link): link is { icon: string; text: string } => Boolean(link));
  const socialLinks = siteConfig?.socialLinks ?? [];

  return (
    <section className="!bg-black -mt-4 py-2 mb-2 hidden md:block">
      <Container>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-white">
            {contactLinks.map((link) => {
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
            {socialLinks.map((link) => {
              const icon = socialIcons[link.platform];
              if (!icon) return null;

              return (
                <Link
                  key={link.href + icon}
                  href={link.href}
                  target={link.isExternal ? "_blank" : "_self"}
                >
                  <Image
                    src={icon}
                    width={23}
                    height={23}
                    className="w-[23px] h-auto"
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
