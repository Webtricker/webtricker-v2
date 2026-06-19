import { makeSlug } from "@/utils/blog";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITag extends Document {
  name: string;
  slug: string;
  color: string;
  postCount: number;
  createdAt: Date;
}

const HEX_COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const tagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  color: {
    type: String,
    default: "#4F46E5",
    validate: {
      validator: (value: string) => HEX_COLOR_REGEX.test(value),
      message: "Color must be a valid hex value",
    },
  },
  postCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

tagSchema.pre("validate", function setTagSlug(next) {
  if (!this.slug && this.name) {
    this.slug = makeSlug(this.name);
  } else if (this.slug) {
    this.slug = makeSlug(this.slug);
  }

  next();
});

const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", tagSchema);

export default Tag;
