import { IBlogPage } from "@/types/pageTypes";
import { model, models, Schema } from "mongoose";

// Define the nested schema for the 'bannerBG' object.
const bannerBGSchema = new Schema({
    type: {
        type: String,
        enum: ['img', 'video'],
        required: true,
    },
    src: {
        type: String,
        required: true,
    },
}, { _id: false });

// Define the main schema for the 'IBlogPage' interface.
const blogPageSchema = new Schema<IBlogPage>({
    bannerBG: {
        type: bannerBGSchema,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// Create or retrieve the Mongoose model to avoid re-compilation issues in a serverless environment.
const BlogPage = models.BlogPage || model<IBlogPage>('BlogPage', blogPageSchema);
export default BlogPage;
