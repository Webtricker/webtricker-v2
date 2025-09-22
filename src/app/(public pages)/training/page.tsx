import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import Image from "next/image";
import bannerBg from "@/assets/images/training/training.webp";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";

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
    detailedDescription:
      "Master the art of creating visually appealing and user-friendly websites. This comprehensive course covers HTML5, CSS3, responsive design, typography, color theory, and modern design frameworks.",
    modules: [
      "HTML5 & CSS3 Fundamentals",
      "Responsive Web Design",
      "Typography & Color Theory",
      "CSS Frameworks (Bootstrap, Tailwind)",
      "Design Tools (Figma, Adobe XD)",
      "Portfolio Development",
    ],
    prerequisites: "Basic computer knowledge",
    certification: "Industry-recognized certificate upon completion",
    tools: ["VS Code", "Figma", "Adobe Creative Suite", "Chrome DevTools"],
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
    detailedDescription:
      "Become a full-stack developer with expertise in both client-side and server-side technologies. Learn JavaScript, React, Node.js, databases, and deployment strategies.",
    modules: [
      "JavaScript ES6+ Fundamentals",
      "React.js & Component Architecture",
      "Node.js & Express.js",
      "Database Design (MongoDB, MySQL)",
      "API Development & Integration",
      "Version Control with Git",
    ],
    prerequisites: "Basic programming knowledge recommended",
    certification: "Full-Stack Developer Certificate",
    tools: ["VS Code", "Node.js", "MongoDB", "Git", "Postman"],
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
    detailedDescription:
      "Develop your creative skills in visual communication, branding, and digital design. Master Adobe Creative Suite and learn design principles that make your work stand out.",
    modules: [
      "Design Principles & Theory",
      "Adobe Photoshop Mastery",
      "Adobe Illustrator Techniques",
      "Brand Identity Design",
      "Print & Digital Media Design",
      "Portfolio Creation",
    ],
    prerequisites: "Creative mindset and basic computer skills",
    certification: "Professional Graphic Designer Certificate",
    tools: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Adobe InDesign",
      "Canva Pro",
    ],
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
    detailedDescription:
      "Learn to create user-centered designs that are both beautiful and functional. Master user research, wireframing, prototyping, and usability testing.",
    modules: [
      "User Research & Analysis",
      "Wireframing & Prototyping",
      "UI Design Principles",
      "Interaction Design",
      "Usability Testing",
      "Design Systems",
    ],
    prerequisites: "Basic design knowledge helpful",
    certification: "UI/UX Designer Professional Certificate",
    tools: ["Figma", "Adobe XD", "Sketch", "InVision", "Miro"],
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
    detailedDescription:
      "Master the digital marketing landscape with hands-on experience in SEO, social media marketing, content marketing, PPC advertising, and analytics.",
    modules: [
      "Digital Marketing Fundamentals",
      "Search Engine Optimization (SEO)",
      "Social Media Marketing",
      "Content Marketing Strategy",
      "Google Ads & Facebook Ads",
      "Analytics & Performance Tracking",
    ],
    prerequisites: "Basic internet and social media knowledge",
    certification: "Digital Marketing Professional Certificate",
    tools: [
      "Google Analytics",
      "Google Ads",
      "Facebook Business Manager",
      "SEMrush",
    ],
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
    detailedDescription:
      "Learn to develop and customize content management systems. Master WordPress, Drupal, and modern headless CMS solutions for dynamic website development.",
    modules: [
      "CMS Fundamentals",
      "WordPress Development",
      "Custom Theme Creation",
      "Plugin Development",
      "Headless CMS (Strapi, Contentful)",
      "E-commerce Integration",
    ],
    prerequisites: "Basic web development knowledge",
    certification: "CMS Developer Certificate",
    tools: ["WordPress", "PHP", "MySQL", "Strapi", "VS Code"],
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
    detailedDescription:
      "Become proficient in the MERN stack and build modern, scalable web applications. Learn MongoDB, Express.js, React, and Node.js with real-world projects.",
    modules: [
      "MongoDB Database Design",
      "Express.js Server Development",
      "React.js Frontend Development",
      "Node.js Backend Programming",
      "Authentication & Authorization",
      "Deployment & DevOps",
    ],
    prerequisites: "JavaScript fundamentals required",
    certification: "MERN Stack Developer Certificate",
    tools: ["MongoDB", "Express.js", "React", "Node.js", "VS Code"],
  },
  {
    id: 8,
    title: "Basic Computer and AI Tools Training",
    description:
      "Master essential computer skills and modern AI tools for enhanced productivity.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
    detailedDescription:
      "Build foundational computer skills and learn to leverage AI tools for increased productivity. Perfect for beginners looking to enhance their digital literacy.",
    modules: [
      "Computer Fundamentals",
      "Internet & Email Basics",
      "File Management & Organization",
      "AI Tools (ChatGPT, Claude, Gemini)",
      "Productivity AI Applications",
      "Digital Security & Privacy",
    ],
    prerequisites: "No prior experience required",
    certification: "Digital Literacy Certificate",
    tools: [
      "Windows/Mac OS",
      "ChatGPT",
      "Google Workspace",
      "AI Writing Tools",
    ],
  },
  {
    id: 9,
    title: "Microsoft Office Tools Training",
    description:
      "Master Microsoft Office suite for professional productivity and efficiency.",
    duration: "6 months",
    onlineFee: 9000,
    offlineFee: 15000,
    currency: "BDT",
    detailedDescription:
      "Become proficient in Microsoft Office applications including Word, Excel, PowerPoint, and Outlook. Learn advanced features and automation techniques.",
    modules: [
      "Microsoft Word Advanced",
      "Excel Formulas & Functions",
      "PowerPoint Presentation Design",
      "Outlook Email Management",
      "Access Database Basics",
      "Office Integration & Automation",
    ],
    prerequisites: "Basic computer knowledge",
    certification: "Microsoft Office Specialist Certificate",
    tools: ["Microsoft Word", "Excel", "PowerPoint", "Outlook", "Access"],
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

                {/* Buttons with gap-3 */}
                <div className="p-6 pt-4 space-y-3">
                  <Link href={`/training/${course.id}`} className="block">
                    <Button
                      label="View Details"
                      className="w-full !rounded-md !px-4 !py-2"
                    />
                  </Link>
                  <Link href={"/contact"} className="block">
                    <Button
                      label="Enroll Now"
                      className="w-full !rounded-md !px-4 !py-2 !bg-black !text-white"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 text-center">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="!text-2xl font-semibold text-black mb-4">
                Why Choose Our Training Programs?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
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

                <div className="text-center">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h3 className="!text-base font-semibold text-black mb-2">
                    Free Internship
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get hands-on experience with our complimentary internship
                    program
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
                        y="7"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <h3 className="!text-base font-semibold text-black mb-2">
                    Job Placement
                  </h3>
                  <p className="text-sm text-gray-600">
                    Career support and job placement assistance after internship
                    completion
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
