import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import React from "react";
import careerBg from "@/assets/images/career/careerBg.jpg";
import CareerCard from "./components/CareerCard";
import { Metadata } from "next";

export type Vacancy = {
  id: number;
  title: string;
  vacancy: number;
};

export type CompanyInfo = {
  id: number;
  description: string;
};


export const metadata: Metadata = {
  title: "Build Your Career with Webtricker",
  description:
    "Join our team: Explore career opportunities with our responsive web design agency."
};

function careerPage() {
  const vacancies: Vacancy[] = [
    {
      id: 1,
      title: "Experienced WordPress Developer",
      vacancy: 1,
    },
    {
      id: 2,
      title: "Frontend Developer",
      vacancy: 1,
    },
    {
      id: 3,
      title: "Excellent UI/UX Designer",
      vacancy: 1,
    },
    {
      id: 4,
      title: "Experienced Marketing Executive",
      vacancy: 1,
    },
    {
      id: 5,
      title: "Experienced Shopify Developer",
      vacancy: 1,
    },
    {
      id: 6,
      title: "Experienced Webflow Developer",
      vacancy: 1,
    },
    {
      id: 7,
      title: "Python Developer",
      vacancy: 0,
    },
    {
      id: 8,
      title: "Java Developer",
      vacancy: 0,
    },
    {
      id: 9,
      title: "Flutter Developer",
      vacancy: 0,
    },
    {
      id: 10,
      title: "Content Writer",
      vacancy: 0,
    },
    {
      id: 11,
      title: "SEO Expert for Webtricker",
      vacancy: 0,
    },
    {
      id: 12,
      title: "MERN Stack Developer",
      vacancy: 0,
    },
  ];

  const companyInfo: CompanyInfo[] = [
    {
      id: 1,
      description:
        "Webtricker believes in people’s freedom and choices. We respect everyone’s thoughts and hear everyone’s concepts to bring a greater outcome. Together we are a team. Anyone’s pain is our pain, and we always try to grow as one family in a friendly atmosphere.",
    },
    {
      id: 2,
      description:
        "We provide 2 bonuses per year along with special bonuses for exceptional achievements and performances. Additionally, we offer affiliate options to help you enlarge your income outside of your salary.",
    },
    {
      id: 3,
      description:
        "Special gratuity and pension packages are available after 5, 10, 15, 20, and 25 years of service. Pension follows a government-like system (conditions apply).",
    },
    {
      id: 4,
      description:
        "We arrange professional training sessions and skill development programs to help employees grow and achieve their career goals.",
    },
    {
      id: 5,
      description:
        "Employee salaries are revised 2 to 3 times per year depending on progress, skills, and performance.",
    },
    {
      id: 6,
      description:
        "Employees enjoy 1-time snacks during office hours for a refreshing break.",
    },
    {
      id: 7,
      description:
        "Dedicated employees get the opportunity to become shareholders of Webtricker under specific conditions.",
    },
    {
      id: 8,
      description:
        "We continuously strive to add more facilities and benefits to create a better and friendlier workplace.",
    },
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
        {/* {pageDate?.bannerBG?.type === "image" ? ( */}
        <Image
          title="Click to change background"
          width={1800}
          height={900}
          src={careerBg.src}
          className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Service Banner Image"
        />
        {/* ) : (
          <video
            title="Click to change background"
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            src={pageDate?.bannerBG?.src || ""}
          >
            <source src={pageDate?.bannerBG?.src || ""} type="video/mp4" />
          </video>
        )} */}
      </section>
      <section>
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <h3>Do you have the courage to be a part of challenging people?</h3>
          <p className="mt-2">
            If you are self motivated, confident but not over confident,
            hardworking, energetic, creative, team player and eager to archive
            something extra ordinary then you are surely welcome to a dynamic
            team!
          </p>
        </div>
        <Container className="flex flex-wrap gap-6 justify-center items-center mt-12">
          {vacancies?.map((vacancy) => (
            <CareerCard key={vacancy?.id} vacancy={vacancy} />
          ))}
        </Container>
      </section>
      <section>
        <div className="max-w-[1000px] mx-auto px-4 mt-16">
          <h5 className="font-semibold">What you expect from us:</h5>
          <ul className="mt-6">
            {companyInfo?.map((info, idx) => (
              <li
                key={info?.id}
                className="mb-4 text-lg flex items-start gap-2 font-medium"
              >
                <span className="text-[#aa013f]">{idx + 1}. </span>
                {info?.description}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default careerPage;
