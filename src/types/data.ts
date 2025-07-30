export type TTechnology = {
  name: string;
  src: string;
}

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
}

export type TBlog = {
  thumnail: string;
  title: string;
  excerpt: string;
  date: string;
  id: string;
}

export type TService = {
  icon?: string;
  title: string;
  description: string;
  excerpt: string;
  thumnail: string;
  relatedWork: string[];
  id: string;
  parmalink: string;
}


export type TPortFolioSlider = {
  id: string;
  title: string;
  subTitle: string;
  href: string;
  img: string;
}


export type TUploadResponse = {
  success: boolean;
  error: boolean;
  message: string;
  uploadedFiles: string[];
}



// category
export type TCategory = { _id: string; name: string }

// navbar link
export type TNavlink = {
  label:string;
  href:string;
  target:"_blank" | "_self";
}


export interface ITeam {
    profile: string;
    name: string;
    role: string;
}

export interface ITeamInfo extends ITeam {
  _id:string;
}
export interface ITestimonials {
    profile: string;
    name: string;
    role: string;
    review:string;
}

export interface ITestimonialsInfo extends ITestimonials {
  _id:string;
}
