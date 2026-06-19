import mongoose from 'mongoose';
interface IPost {
  title: string;
  slug: string;
  description: string;
  subServices?: string[];
  excerp: string;
  thumnail: {
    width?: number;
    height?: number;
    url?: string;
  };
  tags: string[];
  postType: 'service' | 'blog';
  category: { _id: mongoose.Types.ObjectId; name: string };
  content: string;
  focusKeyword?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  thumbnailAlt?: string;
  thumbnailTitle?: string;
  author?: string;
  readingTime?: number;
  featured: boolean;
  published: boolean;
}

const PostSchema = new mongoose.Schema<IPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  subServices: { type: [String], default: [] },
  excerp: { type: String, required: true },
  thumnail: {
    width: { type: Number },
    height: { type: Number },
    url: { type: String },
  },
  tags: { type: [String], default: [] },
  postType: { type: String, enum: ['service', 'blog'], required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    default: new mongoose.Types.ObjectId('687e0480f869c4910bb64f7f'),
  },
  content: { type: String, required: true },
  focusKeyword: { type: String, trim: true },
  seoTitle: { type: String, trim: true, maxlength: 60 },
  seoDescription: { type: String, trim: true, maxlength: 160 },
  canonicalUrl: { type: String, trim: true },
  ogImage: { type: String, trim: true },
  ogImageAlt: { type: String, trim: true },
  thumbnailAlt: { type: String, trim: true },
  thumbnailTitle: { type: String, trim: true },
  author: { type: String, trim: true },
  readingTime: { type: Number },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Indexes at schema definition level
PostSchema.index({ postType: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
