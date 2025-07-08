export type TMediaCB = { url: string; title: string; type: "img" | "video";}

interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  size?: number;  
  format?: string; 
}

export interface TMedia {
  _id:string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string | null;
  metadata?: MediaMetadata;
  createdAt: Date;
}