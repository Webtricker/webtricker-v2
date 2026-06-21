import React from "react";
import Container from "../wrapper/Container";
import Link from "next/link";
import NewsLetterForm from "./NewsLetterForm";
import BouncingText from "../effects/BouncingText";
import {
  getPublicFooterData,
  getServicesData,
} from "@/utils/pageData";
import { footerServicesLink, TFooterService } from "@/data/pageData";
import { IService } from "@/types/post";
import Image from "next/image";
import { IFooter } from "@/types/componentsType";
import footerBg from "@/assets/images/footer/footer-bg.svg";
import pinIcon from "@/assets/images/footer/pin-icon.svg";
import phoneIcon from "@/assets/images/footer/phone-icon.svg";
import emailIcon from "@/assets/images/footer/email-icon.svg";

type SiteConfig = {
  contact?: {
    emails?: string[];
    phones?: string[];
  };
  offices?: {
    label: string;
    addressText: string;
  }[];
  socialLinks?: {
    platform: string;
    href: string;
    isExternal: boolean;
  }[];
};

const socialIcons: Record<string, string> = {
  facebook:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394774/bpcdltvbsjzlht4vjwxa.svg",
  x: "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/bjzfmm45zgjhpyzrlth3.svg",
  linkedin:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394772/jml2zlqdmneozvp51u8k.svg",
  pinterest:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/p70y0hwlyepiaog0mkwd.svg",
  instagram:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/fzxc3um5pqkfdj2h78zh.svg",
  youtube:
    "https://res.cloudinary.com/dnfvjnaki/raw/upload/v1756394773/hudakq7c0esdgepdk1xb.svg",
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

export default async function Footer() {
  const services = (await getServicesData(4)) as IService[];
  const servicesLinks: TFooterService[] =
    services.map((service) => ({
      label: service.title,
      href: `/services/${service.slug}`,
    })) || footerServicesLink;

  // footer data
  const footerData = (await getPublicFooterData()) as IFooter;
  const siteConfig = await fetchSiteConfig();
  const currentYear = new Date().getFullYear().toString();
  const footerSocialLinks = siteConfig?.socialLinks ?? [];
  const offices = siteConfig?.offices ?? [];
  const phones = siteConfig?.contact?.phones ?? [];
  const emails = siteConfig?.contact?.emails ?? [];

  return (
    <footer className="mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18 relative bg-[#141623]">
      <div className="absolute inset-0 w-full h-full z-10">
        <Image
          src={footerBg?.src}
          width={1920}
          height={300}
          alt="Footer background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full pt-14 xl:pt-16 2xl:pt-18 text-slate-200 z-40 relative">
        <Container className="grid  grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-14 md:gap-20">
          {/* ====== footer logo links ==== */}
          <div className="w-full col-span-2 md:col-span-1">
            {footerData?.logo?.white && (
              <div className="mb-5">
                <Image
                  src={footerData.logo.white}
                  alt="Webtricker"
                  width={200}
                  height={60}
                  className="h-auto w-[160px] md:w-[180px] object-contain"
                />
              </div>
            )}
            <div className="flex items-center gap-1 bold">
              <h6 className="footer-heading">Why Us ?</h6>
            </div>
            <p className="text-justify !text-base">
              {footerData?.description || ""}
            </p>
          </div>

          {/* ====== footer page links ==== */}
          <div className="w-full flex flex-row gap-4 md:gap-10 lg:gap-12 col-span-2 md:col-span-1">
            <div className="w-full">
              <h5 className="footer-heading ">
                {footerData?.pages?.title || ""}
              </h5>
              <div className="items-start flex flex-col gap-2 w-full wt_fs-md">
                {footerData?.pages?.links &&
                (footerData?.pages?.links as IFooter["pages"]["links"]).length >
                  0 ? (
                  (footerData?.pages?.links as IFooter["pages"]["links"]).map(
                    (link) => (
                      <Link
                        key={link?.href}
                        href={link?.href || ""}
                        target={link?.isExternal ? "_blank" : "_self"}
                        className="footer-link animate-underline !text-base"
                      >
                        {link?.label || ""}
                      </Link>
                    )
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="w-full">
              <h5 className="footer-heading">
                {footerData?.services?.title || ""}
              </h5>
              <div className="items-start flex flex-col gap-2 w-full wt_fs-md">
                {footerData?.services?.links &&
                (footerData?.services?.links as IFooter["services"]["links"])
                  .length > 0
                  ? (
                      footerData?.services
                        ?.links as IFooter["services"]["links"]
                    ).map((link) => (
                      <Link
                        key={link?.href}
                        href={link?.href || ""}
                        target={link?.isExternal ? "_blank" : "_self"}
                        className="footer-link animate-underline !text-base"
                      >
                        {link?.label || ""}
                      </Link>
                    ))
                  : servicesLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="footer-link animate-underline !text-base"
                      >
                        {item.label}
                      </Link>
                    ))}
              </div>
            </div>
          </div>

          {/* ====== social links ==== */}
          <div className="w-full col-span-2 md:col-span-1">
            <h5 className="footer-heading">
              {footerData?.socialLinks?.title || ""}
            </h5>
            <div className="flex flex-wrap gap-5 md:gap-7 w-full pt-1">
              {footerSocialLinks.length > 0 ? (
                footerSocialLinks.map((item) => {
                  const icon = socialIcons[item.platform];
                  if (!icon) return null;

                  return (
                  <Link
                    key={item.href}
                    target={item?.isExternal ? "_blank" : "_self"}
                    href={item?.href || ""}
                  >
                    <Image
                      src={icon}
                      width={26}
                      height={26}
                      alt="Social icon"
                      className="min-w-5"
                    />
                  </Link>
                  );
                })
              ) : (
                <></>
              )}
            </div>
            <div className="w-full mt-7">
              <label className="wt_fs-md !text-base">
                {footerData?.newsLater?.title || ""}
              </label>
              <NewsLetterForm
                placeholder={footerData?.newsLater?.placeholder || ""}
              />
            </div>
          </div>

          {/* ======= footer links ======= */}
          <div className="w-full flex flex-col items-start col-span-2 md:col-span-1">
            <div className="footer-heading-wrap">
              <Image
                src={pinIcon?.src}
                alt="Address"
                width={24}
                height={24}
                className="min-w-5 w-6 max-w-6 max-h-6 overflow-hidden"
              />
              <h6 className="footer-heading icon-heading">
                Address
              </h6>
            </div>
            <div className="grow not-italic space-y-3">
              {offices.map((office) => (
                <address className="not-italic !text-base" key={office.addressText}>
                  <strong>{office.label}</strong>: {office.addressText}
                </address>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-row gap-4 md:gap-10 lg:gap-14 col-span-2 md:col-span-1">
            {/* ====== phone ======= */}
            <div className="w-full flex flex-col">
              <div className="footer-heading-wrap">
                <Image
                  src={phoneIcon?.src}
                  alt="Phone"
                  width={24}
                  height={24}
                  className="min-w-5 w-6 max-w-6 max-h-6 overflow-hidden"
                />
                <h6 className="footer-heading icon-heading">Phone</h6>
              </div>
              <div className="grow space-y-3">
                {phones
                  ?.slice(0, 3)
                  ?.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="block footer-link animate-underline w-fit !text-base"
                    >
                      {num}
                    </a>
                  ))}
              </div>
            </div>

            {/* ====== hotline ======== */}
            <div className="w-full flex flex-col items-start">
              <div className="footer-heading-wrap">
                <Image
                  src={phoneIcon?.src}
                  alt="Hotline"
                  width={24}
                  height={24}
                  className="min-w-5 w-6 max-w-6 max-h-6 overflow-hidden"
                />
                <h6 className="footer-heading icon-heading">Hotline</h6>
              </div>
              <div className="grow space-y-3">
                {phones
                  ?.slice(3, 6)
                  ?.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="block footer-link animate-underline w-fit !text-base"
                    >
                      {num}
                    </a>
                  ))}
              </div>
            </div>
          </div>

          <div className="w-full flex items-start flex-col col-span-2 md:col-span-1">
            <div className="footer-heading-wrap">
              <Image
                src={emailIcon?.src}
                alt="Email Address"
                width={24}
                height={24}
                className="min-w-5 w-6 max-w-6 max-h-6 overflow-hidden"
              />
              <h6 className="footer-heading icon-heading">
                Email Address
              </h6>
            </div>
            <div className="grow flex flex-col gap-3">
              {emails.map((mail) => (
                <Link
                  key={mail}
                  title="Email"
                  href={`mailto:${mail}`}
                  className="footer-link animate-underline w-fit !text-base"
                >
                  {mail}
                </Link>
              ))}
            </div>
          </div>
        </Container>
        <Container className="my-14">
          <div className="w-full flex items-center justify-center">
            <BouncingText
              size="wt_fs-7xl text-slate-200"
              text={footerData?.bounchingTxt || ""}
              interval={100}
              duration={4}
            />
          </div>
        </Container>
        <section className="!bg-black">
          <Container className="py-2 flex flex-col lg:flex-row justify-between gap-2 items-center text-center lg:text-left">
            <p className="!text-base">
              {footerData?.copyrightTxt?.includes("Dynamic")
                ? footerData?.copyrightTxt?.replace("Dynamic", currentYear) ||
                  ""
                : footerData?.copyrightTxt || ""}
            </p>
            <div className="flex gap-2 items-center">
              <Link
                href={"/privacy-policy"}
                className="footer-link animate-underline !text-base"
              >
                Privacy {"&"} Policy
              </Link>
              <span>|</span>
              <Link
                href={"/terms-and-conditions"}
                className="footer-link animate-underline !text-base"
              >
                Terms {"&"} Condition
              </Link>
            </div>
          </Container>
        </section>
      </div>
    </footer>
  );
}
