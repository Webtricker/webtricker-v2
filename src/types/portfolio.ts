export interface IPortfolio {
  title: string;
  slug: string;
  description: string;
  technology: { _id: string; name: string };
  tags?: { id?: string; _id?: string; name: string; slug?: string; color?: string }[];
  excerp: string;
  thumnail: {
    width?: number;
    height?: number;
    url?: string;
  };
  coverImage: {
    width?: number;
    height?: number;
    url?: string;
  };
  liveLink: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  thumbnailAlt?: string;
  thumbnailTitle?: string;
  coverImageAlt?: string;
  featured?: boolean;
}


export interface TPortfolio extends IPortfolio {
  _id: string;
  createdAt: Date;
}
