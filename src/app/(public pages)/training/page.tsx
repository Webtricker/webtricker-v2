import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import Image from "next/image";
import bannerBg from "@/assets/images/training/training.webp";
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Web Design",
    description:
      "Learn modern web design principles, responsive layouts, and user experience fundamentals.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
  },
  {
    id: 2,
    title: "Web Development",
    description:
      "Master front-end and back-end development with modern frameworks and technologies.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
  },
  {
    id: 3,
    title: "Graphic Design",
    description:
      "Create stunning visual designs using industry-standard tools and design principles.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
  },
  {
    id: 4,
    title: "UI-UX Design",
    description:
      "Design intuitive user interfaces and create exceptional user experiences.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
  },
  {
    id: 5,
    title: "Digital Marketing",
    description:
      "Learn digital marketing strategies, SEO, social media marketing, and analytics.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
  },
  {
    id: 6,
    title: "CMS Development",
    description:
      "Build and customize content management systems using popular platforms.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
  },
  {
    id: 7,
    title: "MERN Stack Development",
    description:
      "Full-stack development with MongoDB, Express.js, React, and Node.js.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
  },
];

export default async function BlogPage() {
  return (
    <main className="w-full z-0">
      <section
        className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
      >
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              Training
            </h1>
          </div>
        </Container>
        <Image
          title="Click to change background"
          width={1800}
          height={900}
          src={bannerBg?.src}
          className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Service Banner Image"
        />
      </section>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="!text-4xl font-bold text-black mb-4">
              Professional Training Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enhance your skills with our comprehensive training programs
              designed for modern professionals
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <h3 className="!text-xl font-semibold text-black mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Card Content */}
                <div className="px-6 pb-4 flex-grow">
                  <div className="space-y-3">
                    {/* Duration */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      <span>Duration: {course.duration}</span>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <rect
                              x="2"
                              y="3"
                              width="20"
                              height="14"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="8" y1="21" x2="16" y2="21"></line>
                            <line x1="12" y1="17" x2="12" y2="21"></line>
                          </svg>
                          <span className="text-gray-600">Online:</span>
                        </div>
                        <span className="bg-gray-100 text-black px-2 py-1 rounded-md font-medium">
                          {course.onlineFee.toLocaleString()} {course.currency}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <span className="text-gray-600">Offline:</span>
                        </div>
                        <span className="border border-gray-300 text-black px-2 py-1 rounded-md font-medium">
                          {course.offlineFee.toLocaleString()} {course.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-4">
                  <Link href="/contact">
                    <button className="w-full bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200">
                      Enroll Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto">
              <h2 className="!text-2xl font-semibold text-black mb-4">
                Why Choose Our Training Programs?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="!text-base font-semibold text-black mb-2">
                    Expert Instructors
                  </h3>
                  <p className="text-sm text-gray-600">
                    Learn from industry professionals with years of experience
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="2"
                        y="3"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <h3 className="!text-base font-semibold text-black mb-2">
                    Flexible Learning
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose between online and offline modes based on your
                    preference
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <h3 className="!text-base font-semibold text-black mb-2">
                    Affordable Pricing
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quality education at competitive prices with flexible
                    payment options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
