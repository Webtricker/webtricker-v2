import TrainingStudio from "@/studio/pages/TrainingStudio";
import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import bannerBg from "@/assets/images/training/training.png";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Programs | Learn Web Design & Development",
  description:
    "Explore Webtricker's professional training programs in Web Design, Web Development, Graphic Design, UI/UX, Digital Marketing, and more.",
  openGraph: {
    type: "website",
    url: "https://webtricker.com/training",
    siteName: "Webtricker",
    title: "Training Programs | Learn Web Design & Development",
    description:
      "Explore Webtricker's professional training programs in Web Design, Web Development, Graphic Design, UI/UX, Digital Marketing, and more.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Webtricker Training Programs" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@webtricker",
    title: "Training Programs | Learn Web Design & Development",
    description:
      "Explore Webtricker's professional training programs in Web Design, Web Development, Graphic Design, UI/UX, Digital Marketing, and more.",
    images: ["/opengraph-image.png"],
  },
  alternates: { canonical: "https://webtricker.com/training" },
};

type CoursePackage = {
  name: string;
  tier: string;
  duration: string;
  totalFee: number;
  offlineTotalFee?: number;
  registrationFee: number;
  installmentAmount: number;
  installmentCount: number;
  currency: string;
  scheduleType?: string;
};

type Course = {
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  packages: CoursePackage[];
};

async function getCourses(): Promise<Course[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/training?published=true&limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.courses ?? [];
  } catch {
    return [];
  }
}

export default function Page() {
  return <TrainingStudio />;
}
