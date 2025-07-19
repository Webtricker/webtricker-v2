import { TCategory } from "./data";

export type TBlog = {
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
      categories: TCategory[];
      content: string;
}