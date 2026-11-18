export interface CaseStudyPoint {
  title: string;
  text: string;
}

/** Structured, answer-engine friendly case study content. Every field is optional. */
export interface CaseStudyData {
  /** 2-3 sentence direct answer: what the project is, what we did, the key result. */
  summary?: string;
  facts?: { label: string; value: string }[];
  metrics?: { value: string; label: string; note?: string }[];
  challenge?: { intro?: string; points?: CaseStudyPoint[] };
  solution?: { intro?: string; points?: CaseStudyPoint[] };
  /** Before/after comparison table. */
  comparison?: { metric: string; before: string; after: string; impact?: string }[];
  results?: { intro?: string; points?: string[] };
  stackTable?: { layer: string; items: string }[];
  takeaways?: string[];
  faq?: { q: string; a: string }[];
}

export interface IPortfolio {
  caseStudy?: CaseStudyData;
  title: string;
  slug: string;
  description: string;
  technology: { _id: string; name: string };
  tags?: { id?: string; _id?: string; name: string; slug?: string; color?: string }[];
  excerp: string;
  stack?: string[];
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
  author?: string;
  seoScore?: number;
  featured?: boolean;
}


export interface TPortfolio extends IPortfolio {
  _id: string;
  createdAt: Date;
  updatedAt?: Date;
}
