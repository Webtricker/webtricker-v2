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
  content: { type: String, required: true },
  liveLink: { type: String, required: true },
}, {
  timestamps: true,
});

// Indexes at schema definition level
PortfolioSchema.index({ tags: 1 });
PortfolioSchema.index({ technology: 1 });

const Portfolio = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);

export default Portfolio;
