import ContactStudio from "@/studio/pages/ContactStudio";
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

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 86400;

type SiteConfig = {
  contact?: {
    phones?: string[];
    emails?: string[];
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
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

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

export default function Page() {
  return <ContactStudio />;
}
