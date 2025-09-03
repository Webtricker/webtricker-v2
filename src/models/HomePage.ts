
import { IHomePage } from '@/types/pageTypes';
import { Schema, model, models } from 'mongoose';



const technologySchema = new Schema({
    icon: { type: String, required: true },
    name: { type: String, required: true },
}, { _id: false });

const homePageSchema = new Schema<IHomePage>(
    {
        greeting: {
            top: { type: String, required: true },
            bottom: { type: String, required: true },
        },
        bannerText: {
            top: { type: String, required: true },
            left: { type: String, required: true },
            right: { type: String, required: true },
        },
        bannerSpinningIconWhite: { type: String, required: true },
        bannerSpinningIconBlack: { type: String, required: true },
        bannerVideo: {
            type: { type: String, enum: ['video', 'image'], required: true },
            src: { type: String, required: true },
        },
        bannerDescription: { type: String, required: true },
        introVideo: { type: String, required: true },
        clientSectionSubtitle: { type: String, required: true },
        clientsBanners: { type: [String], required: true },
        testimonialsBg: { type: String, required: true },

        serviceSectionTitle: {
            large: { type: String, required: true },
            medium: { type: String, required: true },
            small: { type: String, required: true },
        },
        allServiceBtnText: { type: String, required: true },

        allProjectBtnText: { type: String, required: true },

        leadersSectionTitle: { type: String, required: true },

        teamSectionTitle: { type: String, required: true },
        technologoySectionTitle: { type: String, required: true },
        technologies: [{ type: technologySchema }],
        blogSectionTitle: {
            large: { type: String, required: true },
            medium: { type: String, required: true },
            small: { type: String, required: true },
        },
        bottomSlider: { type: [String], required: true, }
    },
    {
        timestamps: false,
    }
);


const Home = models.Home || model<IHomePage>('Home', homePageSchema);
export default Home;