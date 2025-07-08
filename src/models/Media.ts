import { Schema, model, Document } from 'mongoose';

interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  size?: number;  
  format?: string; 
}

export interface IMedia extends Document {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string | null;
  metadata?: MediaMetadata;
  createdAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    thumbnail: { type: String, default: null },
    metadata: {
      width: { type: Number },
      height: { type: Number },
      duration: { type: Number },
      size: { type: Number },
      format: { type: String },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, 
  }
);

const Media = model<IMedia>('Media', mediaSchema);

export default Media;
