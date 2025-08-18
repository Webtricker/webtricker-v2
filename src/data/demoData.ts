import { TOurLeader } from "@/types/data";
import { IHomePage } from "@/types/pageTypes";


export const teamData: TOurLeader[] = [
  {
    image: "/images/team/ceo.jpg",
    name: "Mosharaf Hossain",
    description: "CEO & Founder",
    socialLinks: [
      {
        url: "https://web.facebook.com/mosharafwbt",
        icon: "/svgs/Facebook.svg",
        alt: "facebook",
      },
      {
        url: "https://www.instagram.com/md.rashidh/",
        icon: "/svgs/instagram.svg",
        alt: "instagram",
      },
      {
        url: "https://www.linkedin.com/in/mosharafh/",
        icon: "/svgs/LinkedIn.svg",
        alt: "linkedin",
      },
    ],
  },
  {
    image: "/images/team/minar-profile.jpg",
    name: "Abd Al Muktadir",
    description: "COO",
    socialLinks: [
      {
        url: "https://www.facebook.com/abdalmuktadirminar",
        icon: "/svgs/Facebook.svg",
        alt: "facebook",
      },
      {
        url: "https://www.instagram.com/minar_07?igsh=eGMwM2dlc3BuaW1h",
        icon: "/svgs/instagram.svg",
        alt: "instagram",
      },
      {
        url: "https://www.linkedin.com/in/abdalmuktadir/",
        icon: "/svgs/LinkedIn.svg",
        alt: "linkedin",
      },
    ],
  },
];




export const demoJson:IHomePage = {
  "greeting": {
    "top": "Hello,",
    "bottom": "People! We’re"
  },
  "bannerText": {
    "top": "Creative",
    "left": "Digital",
    "right": "Studio"
  },
  "bannerVideo": {
    "type": "image",
    "src": ""
  },
  "bannerSpinningIconBlack":"",
  "bannerSpinningIconWhite":"",
  "bannerDescription": "Webtricker designs, develops, and delivers high-quality, responsive websites with pixel-perfect precision. We’re passionate, detail-driven, and committed to exceeding expectations. Have a project in mind?",
  "introVideo": "/videos/intro-video.mp4",
  "clientSectionSubtitle": "clients we've worked with",
  "serviceSectionTitle": {
    "large": "Thoughtful",
    "medium": "Process",
    "small": "We Think a lot"
  },
  "allServiceBtnText":"See All Services",
  "allProjectBtnText":"View All Projects",
  "LeadersSectionTitle":"Our Leaders",
  "teamSectionTitle":"Our People",
  "blogSectionTitle": {
    "large": "Updates,",
    "medium": "Insights",
    "small": "Our Newest Articles"
  },
  "testimonialsBg":"",
}