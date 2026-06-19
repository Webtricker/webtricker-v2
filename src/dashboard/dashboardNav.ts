import {
  BarChart3Icon,
  BriefcaseIcon,
  FileTextIcon,
  FolderIcon,
  HomeIcon,
  ImageIcon,
  LayersIcon,
  LockIcon,
  MailIcon,
  MessageSquareIcon,
  MonitorIcon,
  NewspaperIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  TagIcon,
  UserPlusIcon,
  UsersIcon,
  WrenchIcon,
} from "./icons";

export const dashboardNav = [
  {
    label: "",
    items: [
      {
        label: "Dashboard",
        href: "/settings",
        icon: BarChart3Icon,
      },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog Posts", href: "/settings/blogs", icon: NewspaperIcon },
      { label: "Services", href: "/settings/services", icon: WrenchIcon },
      { label: "Portfolio", href: "/settings/portfolios", icon: BriefcaseIcon },
      {
        label: "Testimonials",
        href: "/settings/testimonials",
        icon: MessageSquareIcon,
      },
      { label: "Team Members", href: "/settings/teams", icon: UsersIcon },
      { label: "Leaders", href: "/settings/leader", icon: ShieldIcon },
      { label: "Career Listings", href: "/settings/career", icon: FolderIcon },
      { label: "Tags", href: "/settings/tags", icon: TagIcon },
    ],
  },
  {
    label: "Pages",
    items: [
      { label: "Home Page", href: "/settings/home", icon: HomeIcon },
      { label: "About Page", href: "/settings/about", icon: FileTextIcon },
      { label: "Contact Page", href: "/settings/contact", icon: MailIcon },
      {
        label: "Privacy Policy",
        href: "/settings/privacy-policy",
        icon: LockIcon,
      },
      {
        label: "Terms & Conditions",
        href: "/settings/terms-and-conditions",
        icon: FileTextIcon,
      },
      { label: "Training", href: "/settings/training", icon: LayersIcon },
    ],
  },
  {
    label: "Site Settings",
    items: [
      { label: "Header", href: "/settings/header", icon: MonitorIcon },
      { label: "Footer", href: "/settings/footer", icon: MonitorIcon },
      { label: "Sidebar", href: "/settings/sidebar", icon: SettingsIcon },
      { label: "Logos", href: "/settings/logos", icon: ImageIcon },
      {
        label: "Post Categories",
        href: "/settings/post-categories",
        icon: TagIcon,
      },
      {
        label: "Portfolio Technologies",
        href: "/settings/portfolio-technologies",
        icon: LayersIcon,
      },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Media Library", href: "/settings/media", icon: ImageIcon },
    ],
  },
  {
    label: "Users & Roles",
    // TODO Phase 2: hide this entire group unless role === "superAdmin"
    items: [
      { label: "All Users", href: "/settings/users", icon: UsersIcon },
      { label: "Add User", href: "/settings/users/add", icon: UserPlusIcon },
    ],
  },
  {
    label: "SEO & Schema",
    items: [{ label: "Coming Soon", icon: SearchIcon, disabled: true }],
  },
];
