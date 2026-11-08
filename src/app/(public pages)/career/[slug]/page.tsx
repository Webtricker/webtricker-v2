import JobStudio from "@/studio/pages/JobStudio";
import Button from "@/sharedComponets/ui/buttons/Button";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Career = {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  workMode: string;
  vacancyCount: number;
  salaryRange?: string;
  shortDescription: string;
  fullDescription: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  applicationDeadline?: string;
  howToApply?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  published: boolean;
};

const labelize = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const stripHtml = (value = "") =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

const getApplyHref = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return "/contact";
  if (/^mailto:/i.test(trimmed) || /^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`;
  return "/contact";
};

async function getCareer(slug: string): Promise<Career | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/career/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.career ?? null;
  } catch {
    return null;
  }
}

async function getCareerSlugs(): Promise<{ slug: string }[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${baseUrl}/api/career?published=true&limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.careers ?? []).map((career: Career) => ({ slug: career.slug }));
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return getCareerSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    return {
      title: "Career Listing Not Found",
      description: "The career listing you are looking for does not exist.",
    };
  }

  const title = career.seoTitle || `${career.title} | Careers at Webtricker`;
  const description =
    career.seoDescription ||
    career.shortDescription ||
    stripHtml(career.fullDescription).slice(0, 160);
  const ogImage = career.ogImage || "/opengraph-image.png";
  const canonical = career.canonicalUrl || `https://webtricker.com/career/${career.slug}`;

  return {
    title,
    description,
    keywords: [career.focusKeyword || career.title, career.department, "Webtricker careers"],
    openGraph: {
      type: "website",
      url: `https://webtricker.com/career/${career.slug}`,
      siteName: "Webtricker",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: career.ogImageAlt || career.title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical },
  };
}

function DetailCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="!text-xl font-semibold text-black mb-4">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-gray-600">
            <span className="mt-1 text-[#aa013f]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function CareerDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career || !career.published) notFound();

  const deadline = formatDate(career.applicationDeadline);
  const applyHref = getApplyHref(career.howToApply);
  const applyIsExternal = /^https?:\/\//i.test(applyHref);
  const heroImage = career.ogImage || "/images/career/career-hero-team.png";

  const metaItems = [
    { label: "Department", value: career.department },
    { label: "Location", value: career.location },
    { label: "Employment", value: labelize(career.employmentType) },
    { label: "Experience", value: labelize(career.experienceLevel) },
    { label: "Work Mode", value: labelize(career.workMode) },
    { label: "Vacancy", value: String(career.vacancyCount) },
    ...(deadline ? [{ label: "Deadline", value: deadline }] : []),
    ...(career.salaryRange ? [{ label: "Salary", value: career.salaryRange }] : []),
  ];

  return <JobStudio job={career} />;
}
