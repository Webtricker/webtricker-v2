import mongoose from "mongoose";
interface IService {
  title: string;
  slug: string;
  description: string;
  subServices: string[];
  excerpt: string;
  icon: string;
  thumnail: {
    width?: number;
    height?: number;
    url?: string;
  };
  tags: string[];
  category: string;
  content: string;
}

const ServiceSchema = new mongoose.Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    subServices: { type: [String], default: [] },
    excerpt: { type: String, required: true },
    icon: { type: String, required: true },
    thumnail: {
      width: { type: Number },
      height: { type: Number },
      url: { type: String },
    },
    tags: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      unique: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Indexes at schema definition level
ServiceSchema.index({ postType: 1 });
ServiceSchema.index({ tags: 1 });
ServiceSchema.index({ createdAt: -1 });

const Service =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
