import CourseStudio from "@/studio/pages/CourseStudio";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type CoursePackage = {
  _id?: string;
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
  nextCohortDate?: string;
  classDays?: string;
  enrolledCount?: number;
  rating?: number;
  isPopular?: boolean;
  isJobReady?: boolean;
  modules: { title: string; duration?: string }[];
};

type Course = {
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  detailedDescription: string;
  tools: string[];
  prerequisites?: string;
  certification?: string;
  idealFor?: string[];
  instructor?: {
    name?: string;
    title?: string;
    photo?: string;
    bio?: string;
    experience?: string;
  };
  faq?: { question: string; answer: string }[];
  packages: CoursePackage[];
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
};

async function getCourse(slug: string): Promise<Course | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/training/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.course ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) return { title: "Course Not Found" };

  const title = course.seoTitle || `${course.title} Training`;
  const description = (course.seoDescription || course.detailedDescription || "").replace(/\s+/g, " ").trim().slice(0, 160);
  const ogImg = course.ogImage || "/opengraph-image.png";
  const canonical = course.canonicalUrl || `https://webtricker.com/training/${id}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url: `https://webtricker.com/training/${id}`,
      siteName: "Webtricker",
      title,
      description,
      images: [{ url: ogImg, width: 1200, height: 630, alt: `${course.title} Training` }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title,
      description,
      images: [ogImg],
    },
    alternates: { canonical },
  };
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course || !course.published) notFound();

  return <CourseStudio course={course as any} />;
}
