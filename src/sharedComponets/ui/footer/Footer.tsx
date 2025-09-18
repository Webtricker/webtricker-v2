import React from "react";
import Container from "../wrapper/Container";
import Link from "next/link";
import NewsLetterForm from "./NewsLetterForm";
import BouncingText from "../effects/BouncingText";
import {
  getContactPageData,
  getPublicFooterData,
  getServicesData,
} from "@/utils/pageData";
import { footerServicesLink, TFooterService } from "@/data/pageData";
import { IService } from "@/types/post";
import Image from "next/image";
import { IFooter } from "@/types/componentsType";
import { IContactPage } from "@/types/pageTypes";
import footerBg from "@/assets/images/footer/footer-bg.svg";
import pinIcon from "@/assets/images/footer/pin-icon.svg";
import phoneIcon from "@/assets/images/footer/phone-icon.svg";
import emailIcon from "@/assets/images/footer/email-icon.svg";

export default async function Footer() {
  const services = (await getServicesData(4)) as IService[];
  const servicesLinks: TFooterService[] =
    services.map((service) => ({
      label: service.category,
      href: `/services/${service.slug}`,
    })) || footerServicesLink;

  // footer data
  const footerData = (await getPublicFooterData()) as IFooter;
  const contactPageData = (await getContactPageData()) as IContactPage;
  const currentYear = new Date().getFullYear().toString();

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
        <Container className="grid  grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-14 md:gap-20">

          {/* ====== footer logo links ==== */}
          <div className="w-full">
            <div className="flex items-center gap-1 bold">
              <h6 className="footer-heading">Why Us ?</h6>
            </div>
            <p className="text-justify">
              {footerData?.description || ""}
            </p>
          </div>

          {/* ====== footer page links ==== */}
          <div className="w-full flex flex-col md:flex-row gap-14 md:gap-10 lg:gap-14">
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
                        className="footer-link animate-underline"
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
                    footerData?.services?.links as IFooter["services"]["links"]
                  ).map((link) => (
                    <Link
                      key={link?.href}
                      href={link?.href || ""}
                      target={link?.isExternal ? "_blank" : "_self"}
                      className="footer-link animate-underline"
                    >
                      {link?.label || ""}
                    </Link>
                  ))
                  : servicesLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="footer-link animate-underline"
                    >
                      {item.label}
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* ====== social links ==== */}
          <div className="w-full">
            <h5 className="footer-heading">
              {footerData?.socialLinks?.title || ""}
            </h5>
            <div className="flex flex-wrap gap-5 md:gap-7 w-full pt-1">
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
                      className="min-w-5"
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

          {/* ======= footer links ======= */}
          <div className="w-full flex flex-col items-start">
            <div className="footer-heading-wrap">
              <Image
                src={pinIcon?.src}
                alt={contactPageData?.address?.title}
                width={24}
                height={24}
                className="min-w-5 w-6 max-w-6 max-h-6 overflow-hidden"
              />
              <h6 className="footer-heading icon-heading">
                {contactPageData?.address?.title}
              </h6>
            </div>
            <div className="grow not-italic space-y-3">
              {contactPageData?.address?.addresses?.map((addr) => (
                <address className="not-italic" key={addr?.location}>
                  <strong>{addr?.office}</strong>: {addr?.location}
                </address>
              ))}
            </div>
          </div>


          <div className="w-full flex flex-col md:flex-row gap-14 md:gap-10 lg:gap-14">
            {/* ====== phone ======= */}
            <div className="w-full flex flex-col">
              <div className="footer-heading-wrap">
                <Image
                  src={phoneIcon?.src}
                  alt={contactPageData?.contactNumber?.title}
                  width={24}
                  height={24}
                  className="min-w-5 w-6 max-w-6 max-h-6 overflow-hidden"
                />
                <h6 className="footer-heading icon-heading">
                  Phone
                </h6>
              </div>
              <div className="grow space-y-3">
                {contactPageData?.contactNumber?.numbers
                  ?.slice(0, 3)
                  ?.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="block footer-link animate-underline w-fit"
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
                  alt={contactPageData?.contactNumber?.title}
                  width={24}
                  height={24}
                  className="min-w-5 w-6 max-w-6 max-h-6 overflow-hidden"
                />
                <h6 className="footer-heading icon-heading">
                  Hotline
                </h6>
              </div>
              <div className="grow space-y-3">
                {contactPageData?.contactNumber?.numbers
                  ?.slice(3, 6)
                  ?.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="block footer-link animate-underline w-fit"
                    >
                      {num}
                    </a>
                  ))}
              </div>
            </div>

          </div>


          <div className="w-full flex items-start flex-col">
            <div className="footer-heading-wrap">
              <Image
                src={emailIcon?.src}
                alt={contactPageData?.contactMails?.title}
                width={24}
                height={24}
                className="min-w-5 w-6 max-w-6 max-h-6 overflow-hidden"
              />
              <h6 className="footer-heading icon-heading">
                {contactPageData?.contactMails?.title}
              </h6>
            </div>
            <div className="grow flex flex-col gap-3">
              {contactPageData?.contactMails?.mails?.map((mail) => (
                <Link
                  key={mail}
                  title="Email"
                  href={`mailto:${mail}`}
                  className="footer-link animate-underline w-fit"
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
            <p>
              {footerData?.copyrightTxt?.includes("Dynamic")
                ? footerData?.copyrightTxt?.replace("Dynamic", currentYear) ||
                ""
                : footerData?.copyrightTxt || ""}
            </p>
            <div className="flex gap-2 items-center">
              <Link href={"/privacy-policy"} className="footer-link animate-underline">
                Privacy {"&"} Policy
              </Link>
              <span>|</span>
              <Link
                href={"/terms-and-conditions"}
                className="footer-link animate-underline"
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
