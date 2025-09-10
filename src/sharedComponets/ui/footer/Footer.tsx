import React from "react";
import Container from "../wrapper/Container";
import Link from "next/link";
import NewsLetterForm from "./NewsLetterForm";
import BouncingText from "../effects/BouncingText";
import { getPublicFooterData, getServicesData } from "@/utils/pageData";
import { footerServicesLink, TFooterService } from "@/data/pageData";
import { IService } from "@/types/post";
import Image from "next/image";
import { IFooter } from "@/types/componentsType";

export default async function Footer() {
  const services = (await getServicesData(4)) as IService[];
  const servicesLinks: TFooterService[] =
    services.map((service) => ({
      label: service.category,
      href: `/services/${service.slug}`,
    })) || footerServicesLink;

  // footer data
  const footerData = (await getPublicFooterData()) as IFooter;
  return (
    <footer className="mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
      <div className="w-full bg-slate-200 dark:bg-black py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
        <Container className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-6 lg:gap-8 2xl:gap-16">
          <div className="w-full md:mt-[-4px]">
            <Link className="flex items-center gap-1 bold" href="/">
              <Image
                className="inline dark:hidden w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
                src={footerData?.logo?.black || ""}
                width={282}
                height={74}
                alt="Site logo"
              />
              <Image
                className="hidden dark:inline w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] h-auto"
                src={footerData?.logo?.white || ""}
                width={282}
                height={74}
                alt="Site logo"
              />
            </Link>
            <p className="mt-3 wt_fs-md">{footerData?.description || ""}</p>
          </div>
          <div className="ms-0 md:ms-6 w-full">
            <h5>{footerData?.pages?.title || ""}</h5>
            <div className="mt-3 items-start flex flex-col gap-2 w-full wt_fs-md">
              {footerData?.pages?.links &&
              (footerData?.pages?.links as IFooter["pages"]["links"]).length >
                0 ? (
                (footerData?.pages?.links as IFooter["pages"]["links"]).map(
                  (link) => (
                    <Link
                      key={link?.href}
                      href={link?.href || ""}
                      target={link?.isExternal ? "_blank" : "_self"}
                      className="animate-underline"
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
            <h5>{footerData?.services?.title || ""}</h5>
            <div className="mt-3 items-start flex flex-col gap-2 w-full wt_fs-md">
              {footerData?.services?.links &&
              (footerData?.services?.links as IFooter["services"]["links"])
                .length > 0
                ? (
                    footerData?.services?.links as IFooter["services"]["links"]
                  ).map((link) => (
                    <Link
                      key={link?.href}
                      href={link?.href || ""}
                      target={link?.isExternal ? "_blank" : "_self"}
                      className="animate-underline"
                    >
                      {link?.label || ""}
                    </Link>
                  ))
                : servicesLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="animate-underline"
                    >
                      {item.label}
                    </Link>
                  ))}
            </div>
          </div>
          <div className="w-full">
            <h5>{footerData?.socialLinks?.title || ""}</h5>
            <div className="flex gap-5 md:gap-7 w-full mt-3">
              {footerData?.socialLinks?.links &&
              (
                footerData?.socialLinks
                  ?.links as IFooter["socialLinks"]["links"]
              ).length > 0 ? (
                footerData?.socialLinks?.links.map((item) => (
                  <Link
                    key={item.href}
                    target={item?.isExternal ? "_blank" : "_self"}
                    href={item?.href || ""}
                  >
                    <Image
                      src={item.label || ""}
                      width={26}
                      height={26}
                      alt="Social icon"
                    />
                  </Link>
                ))
              ) : (
                <></>
              )}
            </div>
            <div className="w-full mt-7">
              <label className="wt_fs-md">
                {footerData?.newsLater?.title || ""}
              </label>
              <NewsLetterForm
                placeholder={footerData?.newsLater?.placeholder || ""}
              />
            </div>
          </div>
        </Container>
        <Container className="my-10">
          <div className="w-full flex items-center justify-center">
            <BouncingText
              size="wt_fs-7xl"
              text={footerData?.bounchingTxt || ""}
              interval={100}
              duration={4}
            />
          </div>
        </Container>
        <div className="w-full h-[1px] bg-slate-400/40 dark:bg-slate-800"></div>
        <Container className="text-center mt-5 lg:mt-10">
          <p>{footerData?.copyrightTxt || ""}</p>
        </Container>
      </div>
    </footer>
  );
}
