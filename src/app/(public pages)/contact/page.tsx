import React from "react";
import ContactForm from "./components/ContactForm";
import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import ContactCTABtns from "./components/ContactCTABtns";
import Link from "next/link";
import { Metadata } from "next";
import shortLogo from "@/assets/images/home/webtricker-w.png";
import { getContactPageData } from "@/utils/pageData";
import { IContactPage } from "@/types/pageTypes";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Talk to Us: Contact Webtricker Today",
  description:
    "Connect with us: Reach out to our responsive web design agency for inquiries and collaborations.",
  keywords: [
    "contact Webtricker",
    "web design agency contact",
    "web development agency",
    "business inquiries",
    "collaborations",
    "support",
  ],

  openGraph: {
    type: "website",
    url: "https://webtricker.com/contact",
    siteName: "Webtricker",
    title: "Talk to Us: Contact Webtricker Today",
    description:
      "Connect with Webtricker — a web design & development agency. Let’s discuss your project, collaborations, or support needs.",
    images: [
      {
        url: shortLogo.src,
        width: 1200,
        height: 630,
        alt: "Webtricker - Expert Web Design & Digital Services",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@webtricker", // your brand Twitter handle
    title: "Talk to Us: Contact Webtricker Today",
    description:
      "Reach out to Webtricker for web design & development inquiries, collaborations, or support.",
    images: [shortLogo.src],
  },

  alternates: {
    canonical: "https://webtricker.com/contact",
  },

  category: "technology",
  metadataBase: new URL("https://webtricker.com"),
};

export default async function ContactPage() {
  const contactPageData = (await getContactPageData()) as IContactPage;

  return (
    <main className="w-full z-0">
      <div
        className={`relative w-full mt-[130px] md:mt-[150px] lg:mt-[180px] 2xl:mt-[200px]`}
      >
        <Container>
          <div className="w-full max-w-[1120px] mx-auto">
            <p className="bold flex items-center gap-1">
              <span>{contactPageData?.branding}</span>
              <span className="w-10 h-[1px] mt-1.5 bg-black dark:bg-white"></span>
            </p>
            <h1 className="heading xl:font-semibold !leading-[100%]">
              {contactPageData?.title}
            </h1>
            <div className="w-full flex flex-col gap-5 sm:flex-row pt-8 md:pt-10">
              <div className="w-full">
                <h6 className="bold">{contactPageData?.greetings?.topTxt}</h6>
                <div className="w-full flex items-start mt-2">
                  <p className="bold whitespace-nowrap">
                    {contactPageData?.greetings?.bottomTxt}
                  </p>
                  <div className="hidden sm:block w-full mt-4">
                    <Image
                      className="w-16 md:w-16 h-auto  dark:hidden"
                      src={contactPageData?.greetings?.iconBlack}
                      width={70}
                      height={100}
                      alt="Line svg"
                    />
                    <Image
                      className="w-16 md:w-16 h-auto hidden dark:inline-block"
                      src={contactPageData?.greetings?.iconWhite}
                      width={70}
                      height={100}
                      alt="Line svg"
                    />
                  </div>
                </div>
              </div>
              <ContactForm fetchedFormData={contactPageData?.form} />
            </div>
          </div>
        </Container>
        <ContactCTABtns sidePanelData={contactPageData?.leftPanel} />
      </div>
      <div className="w-full py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18 mt-8 md:mt-10 lg:mt-14 xl:mt-16 2xl:mt-18">
        <Container className="">
          <h4 className="heading 2xl:font-semibold !leading-[100%]">
            {contactPageData?.contactInformationTitle}
          </h4>
          <div className="w-full flex flex-col lg:flex-row gap-10 md:gap-14 2xl:gap-20 ">
            <div className="w-full flex flex-col gap-8 lg:gap-10 max-w-[550px]">
              <div className="w-full flex gap-5 mt-10 items-start">
                <Image
                  src={contactPageData?.address?.iconBlack}
                  alt={contactPageData?.address?.title}
                  width={24}
                  height={24}
                  className="min-w-5 w-6 block dark:hidden"
                />
                <Image
                  src={contactPageData?.address?.iconWhite}
                  alt={contactPageData?.address?.title}
                  width={24}
                  height={24}
                  className="min-w-5 w-6 hidden dark:block"
                />
                <div className="grow not-italic">
                  <h6 className="heading mb-1">
                    {contactPageData?.address?.title}
                  </h6>
                  {contactPageData?.address?.addresses?.map((addr) => (
                    <address className="not-italic" key={addr?.location}>
                      <strong>{addr?.office}</strong>: {addr?.location}
                    </address>
                  ))}
                </div>
              </div>
              <div className="w-full flex gap-5 items-start">
                <Image
                  src={contactPageData?.contactNumber?.iconBlack}
                  alt={contactPageData?.contactNumber?.title}
                  width={24}
                  height={24}
                  className="min-w-5 w-6 mt-1 block dark:hidden"
                />
                <Image
                  src={contactPageData?.contactNumber?.iconWhite}
                  alt={contactPageData?.contactNumber?.title}
                  width={24}
                  height={24}
                  className="min-w-5 w-6 mt-1 hidden dark:block"
                />
                <div className="grow">
                  <h6 className="heading mb-1">
                    {contactPageData?.contactNumber?.title}
                  </h6>
                  {contactPageData?.contactNumber?.numbers?.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      className="block animate-underline w-fit"
                    >
                      {num}
                    </a>
                  ))}
                </div>
              </div>
              <div className="w-full flex gap-5 items-start">
                <Image
                  src={contactPageData?.contactMails?.iconBlack}
                  alt={contactPageData?.contactMails?.title}
                  width={24}
                  height={24}
                  className="min-w-5 w-6 mt-1 block dark:hidden"
                />
                <Image
                  src={contactPageData?.contactMails?.iconWhite}
                  alt={contactPageData?.contactMails?.title}
                  width={24}
                  height={24}
                  className="min-w-5 w-6 mt-1 hidden dark:block"
                />
                <div className="grow flex flex-col">
                  <h6 className="heading mb-1">
                    {contactPageData?.contactMails?.title}
                  </h6>
                  {contactPageData?.contactMails?.mails?.map((mail) => (
                    <Link
                      key={mail}
                      title="Email"
                      href={`mailto:${mail}`}
                      className="animate-underline w-fit"
                    >
                      {mail}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ======= map ======== */}
            <div className="w-full overflow-hidden rounded-[10px]">
              <h6 className="heading mb-5">
                {contactPageData?.googleMap?.title}
              </h6>
              <iframe
                className="min-h-[400px]"
                src={contactPageData?.googleMap?.iframe}
                width="100%"
                height="100%"
                title="Google Maps location of Webtricker Office"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
