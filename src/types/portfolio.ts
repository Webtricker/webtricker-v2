export interface IPortfolio {
  title: string;
  slug: string;
  description: string;
  technology:string[];
  excerp: string;
  thumnail: {
    width?: number;
    height?: number;
    url?: string;
  };
  tags: string[];
  content: string;
}