import CareerStudio from "@/studio/pages/CareerStudio";
import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import React from "react";
import CareerCard from "./components/CareerCard";
import { Metadata } from "next";

export type CareerListing = {
  slug: string;
  title: string;
  vacancyCount: number;
  ogImage?: string;
  ogImageAlt?: string;
};

type CultureItem = {
  title: string;
  description: string;
};

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Build Your Career with Webtricker",
  description:
    "Join our team: Explore career opportunities with our responsive web design agency.",
  openGraph: {
    type: "website",
    url: "https://webtricker.com/career",
    siteName: "Webtricker",
    title: "Build Your Career with Webtricker",
    description:
      "Join our team: Explore career opportunities with our responsive web design agency.",
    images: [
      {
        url: "/images/career/career-hero-team.png",
        width: 1200,
        height: 630,
        alt: "Webtricker career opportunities",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@webtricker",
    title: "Build Your Career with Webtricker",
    description:
      "Join our team: Explore career opportunities with our responsive web design agency.",
    images: ["/images/career/career-hero-team.png"],
  },
  alternates: {
    canonical: "https://webtricker.com/career",
  },
};

async function getCareers(): Promise<CareerListing[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/career?published=true&limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.careers ?? []).map((career: any) => ({
      slug: career.slug,
      title: career.title,
      vacancyCount: Number(career.vacancyCount) || 0,
      ogImage: career.ogImage,
      ogImageAlt: career.ogImageAlt,
    }));
  } catch {
    return [];
  }
}

export default function Page() {
  return <CareerStudio />;
}
