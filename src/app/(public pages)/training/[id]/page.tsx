import Button from "@/sharedComponets/ui/buttons/Button";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: Promise<any> };
}) {
  const courseId = Number.parseInt(await params.id);
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white mt-[120px]">
      {/* Hero Section with SVG pattern */}
      <div className="relative bg-gray-50 border-b border-gray-200">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="!text-4xl font-bold text-black mb-4">
              {course.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="!text-2xl font-semibold text-black mb-4">
                Course Overview
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {course.detailedDescription}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  <span className="text-gray-600">
                    Duration: {course.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-600">{course.certification}</span>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="!text-xl font-semibold text-black mb-4">
                Course Pricing
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Online Mode:</span>
                  <span className="text-xl font-bold text-black">
                    {course.onlineFee.toLocaleString()} {course.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Offline Mode:</span>
                  <span className="text-xl font-bold text-black">
                    {course.offlineFee.toLocaleString()} {course.currency}
                  </span>
                </div>
                <Link href={"/contact"} className="block">
                  <Button
                    label="Enroll Now"
                    className="w-full !rounded-md !px-4 !py-3 !bg-black !text-white"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Modules */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="!text-xl font-semibold text-black mb-4">
              Course Modules
            </h2>
            <ul className="space-y-3">
              {course.modules.map((module, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{module}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Prerequisites */}
          <div className="space-y-6">
            {/* Tools */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="!text-xl font-semibold text-black mb-4">
                Tools You{"'"}ll Learn
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="!text-xl font-semibold text-black mb-4">
                Prerequisites
              </h2>
              <p className="text-gray-600">{course.prerequisites}</p>
            </div>

            {/* Certification */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="!text-xl font-semibold text-black mb-4">
                Certification
              </h2>
              <div className="flex items-start gap-3">
                <svg
                  className="h-6 w-6 text-black mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
          </div>
        </div>
      </div>
    </div>
  );
}
