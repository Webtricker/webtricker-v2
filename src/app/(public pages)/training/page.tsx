import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import bannerBg from "@/assets/images/training/training.webp";
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

export default async function TrainingPage() {
  const courses = await getCourses();

  return (
    <main className="w-full z-0">
      {/* Banner */}
      <section className="w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18">
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              Training
            </h1>
          </div>
        </Container>
        <Image
          title="Training Programs"
          width={1800}
          height={900}
          src={bannerBg?.src}
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Training Banner"
        />
      </section>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="!text-4xl font-bold text-black mb-4">Professional Training Courses</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enhance your skills with our comprehensive training programs designed for modern professionals
            </p>
          </div>

          {/* Courses Grid */}
          {courses.length === 0 ? (
            <p className="text-center text-gray-600 py-12">No courses available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const lowestFee = course.packages.length > 0
                  ? Math.min(...course.packages.map((p) => p.totalFee))
                  : null;
                const lowestPkg = course.packages.find((p) => p.totalFee === lowestFee) ?? course.packages[0];
                const currency = lowestPkg?.currency || "BDT";
                const pkgCount = course.packages.length;

                return (
                  <div
                    key={course.slug}
                    className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                  >
                    {/* Thumbnail */}
                    {course.thumbnail && (
                      <div className="overflow-hidden rounded-t-lg">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <h3 className="!text-xl font-semibold text-black mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
                    </div>

                    {/* Card Content */}
                    <div className="px-6 pb-4 flex-grow">
                      <div className="space-y-3">
                        {/* Duration */}
                        {lowestPkg && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12,6 12,12 16,14" />
                            </svg>
                            <span>Duration: {lowestPkg.duration}</span>
                          </div>
                        )}

                        {/* Packages count */}
                        {pkgCount > 1 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>{pkgCount} packages available</span>
                          </div>
                        )}

                        {/* Pricing */}
                        {lowestFee !== null && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                  <line x1="8" y1="21" x2="16" y2="21" />
                                  <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                <span className="text-gray-600">Starting from:</span>
                              </div>
                              <span className="bg-gray-100 text-black px-2 py-1 rounded-md font-medium">
                                {lowestFee.toLocaleString()} {currency}
                              </span>
                            </div>
                            {lowestPkg && lowestPkg.registrationFee > 0 && (
                              <p className="text-xs text-gray-500">
                                ৳{lowestPkg.registrationFee.toLocaleString()} reg + ৳{lowestPkg.installmentAmount.toLocaleString()} × {lowestPkg.installmentCount} monthly
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="p-6 pt-4 space-y-3">
                      <Link href={`/training/${course.slug}`} className="block">
                        <Button label="View Details" className="w-full !rounded-md !px-4 !py-2" />
                      </Link>
                      <Link href="/contact" className="block">
                        <Button label="Enroll Now" className="w-full !rounded-md !px-4 !py-2 !bg-black !text-white" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Why Choose Section */}
          <div className="mt-16 text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="!text-2xl font-semibold text-black mb-4">Why Choose Our Training Programs?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
                {[
                  { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", label: "Expert Instructors", desc: "Learn from industry professionals with years of experience" },
                  { icon: "M2 3h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3zM8 21h8M12 17v4", label: "Flexible Learning", desc: "Choose between online and offline modes based on your preference" },
                  { icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", label: "Easy Installments", desc: "Pay in easy monthly installments — no large upfront payment" },
                  { icon: "M22 12h-4l-3 9L9 3l-3 9H2", label: "Free Internship", desc: "Get hands-on experience with our complimentary internship program" },
                  { icon: "M2 7h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", label: "Job Placement", desc: "Career support and job placement assistance after internship completion" },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d={icon} />
                      </svg>
                    </div>
                    <h3 className="!text-base font-semibold text-black mb-2">{label}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
