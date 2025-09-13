import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define the TypeScript interface extending Document
export interface IPolicyPage extends Document {
    title: string;
    description: string;
    content: string;
}

// 2. Create the Schema
const PolicyPageSchema: Schema<IPolicyPage> = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // adds createdAt & updatedAt
);

// 3. Create the Model
const PolicyPage: Model<IPolicyPage> =
    mongoose.models.PolicyPage || mongoose.model<IPolicyPage>("PolicyPage", PolicyPageSchema);

export default PolicyPage;
