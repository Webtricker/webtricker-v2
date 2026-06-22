import Button from "@/sharedComponets/ui/buttons/Button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PackageSelector from "./PackageSelector";

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

  const title = course.seoTitle || `${course.title} Training | Webtricker`;
  const description = course.seoDescription || course.detailedDescription;
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

  const hasInstructor = course.instructor &&
    (course.instructor.name || course.instructor.bio || course.instructor.photo);

  return (
    <div className="min-h-screen bg-white mt-[120px]">
      {/* Hero */}
      <div className="relative bg-gray-50 border-b border-gray-200">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="!text-4xl font-bold text-black mb-4">{course.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </Link>
        </div>

        {/* Package selector + Course Header + Modules (client component) */}
        <PackageSelector
          packages={course.packages}
          detailedDescription={course.detailedDescription}
          certification={course.certification}
          idealFor={course.idealFor}
        />

        {/* Instructor */}
        {hasInstructor && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="!text-xl font-semibold text-black mb-4">Your Instructor</h2>
            <div className="flex gap-5 flex-wrap">
              {course.instructor!.photo && (
                <img
                  src={course.instructor!.photo}
                  alt={course.instructor!.name || "Instructor"}
                  className="w-20 h-20 rounded-full object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                {course.instructor!.name && (
                  <p className="font-semibold text-black">{course.instructor!.name}</p>
                )}
                {course.instructor!.title && (
                  <p className="text-sm text-gray-600">{course.instructor!.title}</p>
                )}
                {course.instructor!.experience && (
                  <p className="text-sm text-gray-500 mt-0.5">{course.instructor!.experience} experience</p>
                )}
                {course.instructor!.bio && (
                  <p className="mt-3 text-gray-600 text-sm">{course.instructor!.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tools, Prerequisites, Certification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {course.tools && course.tools.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="!text-xl font-semibold text-black mb-4">Tools You{"'"}ll Learn</h2>
              <div className="flex flex-wrap gap-2">
                {course.tools.map((tool) => (
                  <span key={tool} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {course.prerequisites && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="!text-xl font-semibold text-black mb-4">Prerequisites</h2>
                <p className="text-gray-600">{course.prerequisites}</p>
              </div>
            )}

            {course.certification && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="!text-xl font-semibold text-black mb-4">Certification</h2>
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600">{course.certification}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        {course.faq && course.faq.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="!text-xl font-semibold text-black mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {course.faq.map((item, i) => (
                <details key={i} className="group border border-gray-200 rounded-lg">
                  <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium text-black">
                    {item.question}
                    <svg
                      className="h-4 w-4 shrink-0 text-gray-500 transition group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h2 className="!text-2xl font-semibold text-black mb-2">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">Enrol now and take the first step toward your new career.</p>
          <Link href="/contact">
            <Button label="Enroll Now" className="!rounded-md !px-8 !py-3 !bg-black !text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
