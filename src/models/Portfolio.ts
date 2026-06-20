import { IPortfolio } from '@/types/portfolio';
import mongoose from 'mongoose';


const PortfolioSchema = new mongoose.Schema<IPortfolio>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  excerp: { type: String, required: true },
  thumnail: {
    width: { type: Number },
    height: { type: Number },
    url: { type: String },
  },
  coverImage: {
    width: { type: Number },
    height: { type: Number },
    url: { type: String },
  },
  technology: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    required: true,
  },
  tags: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    default: [],
  },
  content: { type: String, required: true },
  liveLink: { type: String, required: true },
  seoTitle: { type: String },
  seoDescription: { type: String },
  focusKeyword: { type: String },
  canonicalUrl: { type: String },
  ogImage: { type: String },
  ogImageAlt: { type: String },
  thumbnailAlt: { type: String },
  thumbnailTitle: { type: String },
  coverImageAlt: { type: String },
  author: { type: String, trim: true },
  featured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Indexes at schema definition level
PortfolioSchema.index({ tags: 1 });
PortfolioSchema.index({ technology: 1 });

const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
