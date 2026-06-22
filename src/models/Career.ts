import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead"],
      required: true,
    },
    workMode: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      required: true,
      default: "onsite",
    },
    vacancyCount: { type: Number, default: 1, min: 0 },
    salaryRange: { type: String, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    niceToHave: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    applicationDeadline: { type: Date },
    howToApply: { type: String, trim: true },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    focusKeyword: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    ogImageAlt: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CareerSchema.index({ published: 1 });
CareerSchema.index({ featured: 1 });
CareerSchema.index({ updatedAt: -1 });

const Career = mongoose.models.Career || mongoose.model("Career", CareerSchema);

export default Career;
