export type HomeBlockType =
  | "hero"
  | "mediaIntro"
  | "logoMarquee"
  | "testimonialSlider"
  | "technologyGrid"
  | "collectionPreview"
  | "marquee"
  | "portfolioShowcase"
  | "portfolioSlider"
  | "leaderGrid"
  | "teamSlider"
  | "imageFeed";

export type HomePageBlock = {
  id: string;
  type: HomeBlockType;
  order: number;
  visible: boolean;
  data: Record<string, any>;
};

export interface IHomePage {
  // banner section
  greeting: {
    top: string;
    bottom: string;
  };
  bannerText: {
    top: string;
    left: string;
    right: string;
  };

  bannerSpinningIconWhite: string;
  bannerSpinningIconBlack: string;
  bannerVideo: { type: "video" | "image"; src: string };
  bannerDescription: string;

  // testimonials
  testimonialsBg: string;

  //   intro section
  introVideo: { type: "video" | "image"; src: string };

  // clients section
  clientSectionSubtitle: string;
  clientsBanners: string[];

  // service section
  serviceSectionTitle: {
    large: string;
    medium: string;
    small: string;
  };
  allServiceBtnText: string;
  allProjectBtnText: string;

  // leaders section
  leadersSectionTitle: string;

  // team section
  teamSectionTitle: string;

  // technologoies
  technologoySectionTitle: string;
  technologies: {
    icon: string;
    name: string;
  }[];
  // home latest blog
  blogSectionTitle: {
    large: string;
    medium: string;
    small: string;
  };

  bottomSlider: string[];
  sections?: HomePageBlock[];
}

export interface IAboutPage {
  // banner section
  bannerIntroText: {
    top: string;
    bottom: string;
  };
  bannerLargeText: string;
  bannerDescription: string;
  scrollDwonText: string;
  bannerBottomText: string;
  bannerBottomBtnText: string;
  bannerBottomBtnLink: string;
  bannerBackgroundImage: string;

  // intro images
  introImages: {
    large: string;
    medium: string;
    small: string;
  };
  introText: string;

  // about us section
  aboutUsText: string;
  aboutUsDescription: string;
  aboutUsImage: string;

  // our mission
  ourMissionText: string;
  ourMissionDescription: string;

  // our goals
  ourGoalsText: string;
  ourGoalsDescription: string;

  // why us
  whyUsText: string;
  whyUsDescription: string;

  // what we offer
  whatWeOfferTitle: string;
  whatWeOfferSubtitle: string;
  whatWeOfferCurveIconWhite: string;
  whatWeOfferCurveIconBlack: string;

  // what we offer
  whatWeOfferItems: string[];

  // team info
  teamInfoTitle: string;

  // about us analytics
  aboutUsAnalytics: {
    title: string;
    subTitle: string;
    teamMembers: string;
    teamMembersText: string;
    projectsCompleted: string;
    projectsCompletedText: string;
    growingRate: string;
    growingRateText: string;
    yearsOfExperience: string;
    yearsOfExperienceText: string;
  };

  // Our Clients
  ourClientsSectionBg: string;

  // bottom text
  resumeeSendingText: string;
  resumeeSendingEmail: string;
  bottomTextLarge: string;
}

type BottomText = {
  expression: string;
  title: string;
};

export interface IServicesPage {
  banner: {
    title: string;
    description: string;
  };
  bannerBG: {
    type: "image" | "video";
    src: string;
  };
  servicesShotcut: {
    iconWhite: string;
    iconBlack: string;
    title: string;
    subtitle: string;
  };
  bottomText: BottomText;
}

export interface IPortfolioPage {
  bannerSlider: {
    img: string;
    technology: string;
    name: string;
    _id?: string;
  }[];
  projectIntroduction: {
    companyName: string;
    title: string;
    description: string;
  };
  bottomText: BottomText;
}

export interface IBlogPage {
  bannerBG: {
    type: "image" | "video";
    src: string;
  };
  title: string;
  description: string;
}

type TFormInput = {
  label: string;
  placeholder: string;
};

type ContactForm = {
  name: TFormInput;
  email: TFormInput;
  message: TFormInput;
  btnText: string;
  mailTo: string;
};

type TContactAddress = {
  iconWhite: string;
  iconBlack: string;
  title: string;
  addresses: { office: string; location: string }[];
};

type TPhone = {
  iconWhite: string;
  iconBlack: string;
  title: string;
  numbers: string[];
};

type TEmail = {
  iconWhite: string;
  iconBlack: string;
  title: string;
  mails: string[];
};

type TGreetings = {
  topTxt: string;
  bottomTxt: string;
  iconBlack: string;
  iconWhite: string;
};

type TLeftPanel = {
  socialLinks: { icon: string; href: string }[];
  text: string;
};

type TGoogleMap = {
  title: string;
  iframe: string;
};

export interface IContactPage {
  branding: string;
  title: string;
  greetings: TGreetings;
  form: ContactForm;
  leftPanel: TLeftPanel;
  contactInformationTitle: string;
  address: TContactAddress;
  contactNumber: TPhone;
  contactMails: TEmail;
  googleMap: TGoogleMap;
}


export interface IPolicyPage {
  title: string;
  description: string;
  content: string;
}
