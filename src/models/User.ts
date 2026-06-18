import mongoose, { Schema, Document, Model } from "mongoose";

export const USER_ROLES = ["superAdmin", "editor", "intern"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  // Legacy hashed password field retained only so existing admins can log in once and migrate.
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: USER_ROLES,
    default: "intern",
  },
  avatar: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

// Avoid model overwrite in development (Next.js hot reload)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
