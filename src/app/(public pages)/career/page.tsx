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
export const revalidate = 0;

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

async function careerPage() {
  const vacancies = await getCareers();
  const benefits: CultureItem[] = [
    { title: "Performance Bonuses", description: "Two yearly bonuses plus special recognition for exceptional achievements and measurable impact." },
    { title: "Career Development", description: "Professional training, skill development sessions, mentoring, and room to grow into stronger responsibilities." },
    { title: "Salary Reviews", description: "Salary revision opportunities 2 to 3 times per year based on progress, skill growth, and performance." },
    { title: "Long-Term Security", description: "Special gratuity and pension-style packages after long-term service milestones, subject to company policy." },
    { title: "Affiliate Earning", description: "Affiliate opportunities to help team members expand income beyond their regular salary." },
    { title: "Daily Workplace Care", description: "Refreshment support during office hours and a friendly environment built for sustainable work." },
  ];
  const teamValues: CultureItem[] = [
    { title: "Freedom and Ownership", description: "We respect ideas, choices, and thoughtful initiative so team members can contribute beyond a job description." },
    { title: "One-Team Culture", description: "Anyone's challenge is treated as a shared challenge. We grow together through support, feedback, and trust." },
    { title: "Voice in Decisions", description: "We listen to practical suggestions from every role and value people who help improve the company." },
    { title: "Path to Partnership", description: "Dedicated long-term contributors may get opportunities to become shareholders under specific conditions." },
    { title: "Human Respect", description: "People are not treated as ordinary job holders; they are collaborators with goals, families, and futures." },
    { title: "Recognition for Impact", description: "Strong contribution, leadership, loyalty, and problem-solving are noticed and rewarded over time." },
  ];

  return (
    <main>
      <section
        className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
      >
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              Career
            </h1>
          </div>
        </Container>
        <Image
          title="Career at Webtricker"
          width={1800}
          height={900}
          src="/images/career/career-hero-team.png"
          className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Webtricker career team collaboration"
          priority
        />
      </section>
      <section>
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <h3>Do you have the courage to be a part of challenging people?</h3>
          <p className="mt-2">
            If you are a self motivated, confident but not over confident,
            hardworking, energetic, creative, team player and eager to archive
            something extra ordinary then you are surely welcome to a dynamic
            team!
          </p>
        </div>
        <Container className="flex flex-wrap gap-6 justify-center items-stretch mt-12">
          {vacancies.length > 0 ? (
            vacancies.map((vacancy) => (
              <CareerCard key={vacancy.slug} vacancy={vacancy} />
            ))
          ) : (
            <p className="text-center text-lg font-medium">
              No open positions are available at the moment.
            </p>
          )}
        </Container>
      </section>
      <section>
        <Container className="mt-16 pb-16">
          <div className="max-w-[1000px] mx-auto text-center mb-10">
            <h3>What you can expect from us</h3>
            <p className="mt-2 text-lg text-gray-600">
              We want every person here to feel respected, supported, and valued as a real team member.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h5 className="font-semibold mb-6">Benefits & Perks</h5>
              <div className="grid gap-5">
                {benefits.map((item, idx) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-[#aa013f] font-semibold">{String(idx + 1).padStart(2, "0")}</span>
                    <div>
                      <h6 className="!text-lg font-semibold">{item.title}</h6>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
              <h5 className="font-semibold mb-6">How We Value Our Team</h5>
              <div className="grid gap-5">
                {teamValues.map((item, idx) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-[#aa013f] font-semibold">{String(idx + 1).padStart(2, "0")}</span>
                    <div>
                      <h6 className="!text-lg font-semibold">{item.title}</h6>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default careerPage;
