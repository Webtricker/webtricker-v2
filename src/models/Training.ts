import mongoose from 'mongoose';

const PackageModuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String },
    project: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tier: { type: String, enum: ['certificate', 'professional', 'job-ready'], default: 'certificate' },
  duration: { type: String, required: true },
  totalFee: { type: Number, required: true },
  offlineTotalFee: { type: Number },
  registrationFee: { type: Number, required: true },
  installmentAmount: { type: Number, required: true },
  installmentCount: { type: Number, required: true },
  currency: { type: String, default: 'BDT' },
  modules: { type: [PackageModuleSchema], default: [] },
  scheduleType: { type: String, enum: ['online', 'offline', 'both'], default: 'both' },
  nextCohortDate: { type: Date },
  classDays: { type: String },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isPopular: { type: Boolean, default: false },
  isJobReady: { type: Boolean, default: false },
  outcomeStatement: { type: String },
  deliverables: { type: [String], default: [] },
  idealForThisPackage: { type: String },
});

const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String },
    title: { type: String },
    photo: { type: String },
    bio: { type: String },
    experience: { type: String },
  },
  { _id: false }
);

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const TrainingSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true },
    thumbnail: { type: String },
    description: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    tools: { type: [String], default: [] },
    prerequisites: { type: String },
    certification: { type: String },
    instructor: { type: InstructorSchema },
    idealFor: { type: [String], default: [] },
    faq: { type: [FaqSchema], default: [] },
    packages: { type: [PackageSchema], default: [] },
    seoTitle: { type: String, trim: true, maxlength: 60 },
    seoDescription: { type: String, trim: true, maxlength: 160 },
    focusKeyword: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    ogImageAlt: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TrainingSchema.index({ published: 1 });

const Training = mongoose.models.Training || mongoose.model('Training', TrainingSchema);
export default Training;
