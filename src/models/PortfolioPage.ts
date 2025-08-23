import { IPortfolioPage } from "@/types/pageTypes";
import { model, models, Schema } from "mongoose";

// Define the schema for a single item within the bannerSlider array.
const bannerSliderItemSchema = new Schema({
    img: {
        type: String,
        required: true,
    },
    technology: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
}, { _id: false });

// Define the schema for the projectIntroduction object.
const projectIntroductionSchema = new Schema({
    companyName: {
        type: String,
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
}, { _id: false });

// Define the schema for the bottomText object.
// This is a common pattern, so we define it as a reusable sub-schema.
const bottomTextSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { _id: false });

// Define the main schema for the 'IPortfolioPage' interface.
const portfolioPageSchema = new Schema<IPortfolioPage>({
    bannerSlider: {
        type: [bannerSliderItemSchema],
        required: true,
    },
    projectIntroduction: {
        type: projectIntroductionSchema,
        required: true,
    },
    bottomText: {
        type: bottomTextSchema,
        required: true,
    }
}, {
    timestamps: true,
});

// Create or retrieve the Mongoose model to avoid re-compilation issues in a serverless environment.
const PortfolioPage = models.PortfolioPage || model<IPortfolioPage>('PortfolioPage', portfolioPageSchema);

export default PortfolioPage;
