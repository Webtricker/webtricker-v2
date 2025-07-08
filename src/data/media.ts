import { TMedia } from "@/types/commonTypes";
import { Types } from 'mongoose';

function generateObjectId(): string {
  return new Types.ObjectId().toHexString();
}

export const demoMedia: TMedia[] = [
  {
    _id: generateObjectId(),
    url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    type: 'image',
    thumbnail: null,
    metadata: {
      width: 864,
      height: 576,
      format: 'jpg',
      size: 150000,
    },
    createdAt: new Date('2024-01-10'),
  },
  {
    _id: generateObjectId(),
    url: 'https://images.unsplash.com/photo-1587502536263-9298f2a49165?w=1000',
    type: 'image',
    thumbnail: null,
    metadata: {
      width: 1000,
      height: 667,
      format: 'jpg',
      size: 200000,
    },
    createdAt: new Date('2024-01-11'),
  },
  {
    _id: generateObjectId(),
    url: 'https://images.unsplash.com/photo-1602526432404-94b2a50ac094?w=900',
    type: 'image',
    thumbnail: null,
    metadata: {
      width: 900,
      height: 600,
      format: 'jpg',
      size: 180000,
    },
    createdAt: new Date('2024-01-12'),
  },
  {
    _id: generateObjectId(),
    url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=1000',
    type: 'image',
    thumbnail: null,
    metadata: {
      width: 1000,
      height: 667,
      format: 'jpg',
      size: 210000,
    },
    createdAt: new Date('2024-01-13'),
  },
  {
    _id: generateObjectId(),
    url: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=1000',
    type: 'image',
    thumbnail: null,
    metadata: {
      width: 1000,
      height: 667,
      format: 'jpg',
      size: 220000,
    },
    createdAt: new Date('2024-01-14'),
  },
  {
    _id: generateObjectId(),
    url: 'https://res.cloudinary.com/demo/video/upload/vc_auto/sample.mp4',
    type: 'video',
    thumbnail: 'https://res.cloudinary.com/demo/video/upload/so_5/sample.jpg',
    metadata: {
      duration: 15,
      format: 'mp4',
      width: 640,
      height: 360,
      size: 2100000,
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    _id: generateObjectId(),
    url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    type: 'video',
    thumbnail: null,
    metadata: {
      duration: 5,
      format: 'mp4',
      width: 1280,
      height: 720,
      size: 500000,
    },
    createdAt: new Date('2024-01-16'),
  },
  {
    _id: generateObjectId(),
    url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    type: 'video',
    thumbnail: null,
    metadata: {
      duration: 52,
      format: 'mp4',
      width: 854,
      height: 480,
      size: 4200000,
    },
    createdAt: new Date('2024-01-17'),
  },
];
