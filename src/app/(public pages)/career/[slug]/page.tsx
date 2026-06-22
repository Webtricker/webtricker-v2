import Button from "@/sharedComponets/ui/buttons/Button";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import Container from "@/sharedComponets/ui/wrapper/Container";
import careerBg from "@/assets/images/career/careerBg.jpg";
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

  return (
    <main>
      <section className="w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18">
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <p className="text-white/80 font-medium mb-3">Career Opportunity</p>
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              {career.title}
            </h1>
          </div>
        </Container>
        <Image
          title={career.title}
          width={1800}
          height={900}
          src={careerBg.src}
          className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Career Banner Image"
          priority
        />
      </section>

      <section className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/career"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Career
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mb-8">
            <div>
              <h2 className="!text-4xl font-bold text-black mb-4">{career.title}</h2>
              <p className="text-xl text-gray-600">{career.shortDescription}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
              <h2 className="!text-xl font-semibold text-black mb-4">Job Summary</h2>
              <div className="grid gap-3">
                {metaItems.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-semibold text-black text-right">{item.value}</span>
                  </div>
                ))}
              </div>
              <a
                href={applyHref}
                target={applyIsExternal ? "_blank" : undefined}
                rel={applyIsExternal ? "noopener noreferrer" : undefined}
                className="block mt-6"
              >
                <Button label="Apply Now" className="w-full !rounded-md !px-4 !py-3 !bg-black !text-white" />
              </a>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 wt_parser_content">
            <h2 className="!text-xl font-semibold text-black mb-4">About This Role</h2>
            <HtmlContentParser htmlContent={career.fullDescription} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <DetailCard title="Responsibilities" items={career.responsibilities || []} />
            <DetailCard title="Requirements" items={career.requirements || []} />
            <DetailCard title="Nice To Have" items={career.niceToHave || []} />
            <DetailCard title="Benefits" items={career.benefits || []} />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="!text-xl font-semibold text-black mb-4">How to Apply</h2>
            {career.howToApply ? (
              <p className="text-gray-600">{career.howToApply}</p>
            ) : (
              <p className="text-gray-600">
                Send your details through our contact page and mention the position title.
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <h2 className="!text-2xl font-semibold text-black mb-2">Ready to Join Webtricker?</h2>
            <p className="text-gray-600 mb-6">
              Apply now and take the next step in your career with our team.
            </p>
            <a
              href={applyHref}
              target={applyIsExternal ? "_blank" : undefined}
              rel={applyIsExternal ? "noopener noreferrer" : undefined}
            >
              <Button label="Apply Now" className="!rounded-md !px-8 !py-3 !bg-black !text-white" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
