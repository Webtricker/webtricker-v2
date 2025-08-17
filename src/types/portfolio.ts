export interface IPortfolio {
  title: string;
  slug: string;
  description: string;
  technology: { _id: string; name: string };
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
}


export interface TPortfolio extends IPortfolio {
  _id: string;
  createdAt: Date;
}
