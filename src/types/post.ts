import { TCategory } from "./data";

export interface TBlog {
  title: string;
  slug: string;
  description: string;
  excerp: string;
  thumnail: {
    width?: number;
    height?: number;
    url?: string;
  };
  tags: string[];
  postType: 'service' | 'blog';
  category: TCategory | null;
  content: string;
}

export interface IBlog extends TBlog {
  _id: string;
  createdAt: Date;
  thumnail: {
    width: number;
    height: number;
    url: string;
  };
}

export interface TService {
  title: string;
  slug: string;
  description: string;
  excerp: string;
  tags: string[];
  category:string;
  subServices: string[];
  content: string;
  thumnail: {
    width: number;
    height: number;
    url: string;
  };
}

export interface IService extends TService {
  _id:string;
  createdAt: Date;
}