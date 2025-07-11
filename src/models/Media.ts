import { Schema, model, models } from 'mongoose';

export interface IMedia {
  secure_url: string;
  resource_type: 'image' | 'video';
  asset_id: string;
  public_id: string;
  format: string;
  duration?:number;
  width: number;
  height: number;
  size: number; 
}
const mediaSchema = new Schema<IMedia>(
  {
    secure_url: { type: String, required: true },
    resource_type: { type: String, enum: ['image', 'video'], required: true },

    asset_id: { type: String, required: true },
    public_id: { type: String, required: true },
    format: { type: String, required: true },
    duration: { type: Number, default: 0 },

    width: { type: Number, required: true },
    height: { type: Number, required: true },
    size: { type: Number, required: true },
  },
  {
    timestamps: false,
  }
);

const Media = models.Media || model<IMedia>('Media', mediaSchema);

export default Media;
