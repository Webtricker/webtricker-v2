export type TTechnology = {
  name: string;
  src: string;
};

export type TTestimonial = {
  id: string;
  image: string;
  name: string;
  role: string;
  description: string;
};

export type TTeamData = {
  profile: string;
  name: string;
  role: string;
  bio?: string;
  linkedin?: string;
};

export type TBlog = {
  thumnail: string;
  title: string;
  excerpt: string;
  date: string;
  id: string;
};

export type TService = {
  icon?: string;
  title: string;
  description: string;
  excerpt: string;
  thumnail: string;
  relatedWork: string[];
  _id: string;
  parmalink: string;
};

export type TPortFolioSlider = {
  id: string;
  title: string;
  subTitle: string;
  href: string;
  img: string;
};

export type TUploadResponse = {
  success: boolean;
  error: boolean;
  message: string;
  uploadedFiles: string[];
};

// category
export type TCategory = { _id: string; name: string };
export type ITechnology = { _id: string; name: string };

// navbar link
export type TNavlink = {
  label: string;
  href: string;
  target: "_blank" | "_self";
};

export interface ITeam {
  profile: string;
  name: string;
  role: string;
  bio?: string;
  linkedin?: string;
}

export interface ITeamInfo extends ITeam {
  _id: string;
}
export interface ITestimonials {
  profile: string;
  name: string;
  role: string;
  review: string;
}

export interface ITestimonialsInfo extends ITestimonials {
  _id: string;
}

type SocialLink = {
  url: string;
  icon: string;
  alt: string;
};

export type TOurLeader = {
  image: string;
  name: string;
  description: string; // This used to be memberDesc
  socialLinks: SocialLink[];
};

export type TSocialLink = {
  iconURL: string;
  link: string;
  _id: number;
};

export interface ILeader {
  profile: string;
  name: string;
  role: string;
  facebookLink: string;
  instagramLink: string;
  linkedInLink: string;
}

export interface ILeaderInfo extends ILeader {
  _id: string;
}

export interface HTechnology {
  _id: string;
  name: string;
  icon: string;
}
