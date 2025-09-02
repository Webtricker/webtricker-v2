import { TSocialLink } from "@/types/data";

type TLink = {
  label: string;
  href: string;
};
export const navLinks: TLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  // { label: "Career", href: "/career" },
  { label: "Contact", href: "/contact" },
];


export const settingsLinks: TLink[] = [
  { label: "Logos", href: "/settings/logos" },
  { label: "Menu", href: "/settings/menu" },
  { label: "Header", href: "/settings/header" },
  { label: "Sidebar", href: "/settings/sidebar" },
  { label: "Home", href: "/settings/home" },
  { label: "About", href: "/settings/about" },
  { label: "Services", href: "/settings/services" },
  { label: "Blogs", href: "/settings/blogs" },
  { label: "Post Categories", href: "/settings/post-categories" },
  { label: "Portfolios", href: "/settings/portfolios" },
  { label: "Portfolio Technologies", href: "/settings/portfolio-technologies" },
  { label: "Contact", href: "/settings/contact" },
  { label: "Leaders", href: "/settings/leader" },
  { label: "Teams", href: "/settings/teams" },
  { label: "Testimonials", href: "/settings/testimonials" },
  {
    label: "Footer",
    href: "/settings/footer"
  },
]




// social links
const getRandomID = () => parseInt((Math.random() * 30) + '');
export const socialLinks: TSocialLink[] = [
  {
    iconURL: "/icons/home/facebook.svg",
    link: "https://www.facebook.com/webtricker",
    _id: getRandomID(),
  },
  {
    _id: getRandomID(),
    iconURL: "/icons/home/twitter.svg",
    link: "https://x.com/webtricker"
  },
  {
    _id: getRandomID(),
    iconURL: "/icons/home/linkedIn.svg",
    link: 'https://www.linkedin.com/company/webtricker'
  },
  {
    _id: getRandomID(),
    iconURL: "/icons/home/pinterest.svg",
    link: "https://www.pinterest.com/webtricker"
  },
  {
    _id: getRandomID(),
    iconURL: "/icons/home/instagram.svg",
    link: "https://www.instagram.com/webtricker"
  },
] 