import { IAboutPage } from '@/types/pageTypes';
import { Schema, model, models } from 'mongoose';

const aboutBlockTypes = [
    'aboutHero',
    'aboutGallery',
    'aboutIntroText',
    'aboutStory',
    'whatWeOffer',
    'teamSlider',
    'funFacts',
    'testimonialSlider',
    'resumeCta',
] as const;

const aboutBlockSchema = new Schema(
    {
        id: { type: String, required: true },
        type: { type: String, enum: aboutBlockTypes, required: true },
        order: { type: Number, required: true },
        visible: { type: Boolean, default: true },
        data: { type: Schema.Types.Mixed, default: {} },
    },
    { _id: false }
);

const aboutPageSchema = new Schema<IAboutPage>(
    {
        // Banner Section
        bannerIntroText: {
            top: { type: String, required: true },
            bottom: { type: String, required: true },
        },
        bannerLargeText: { type: String, required: true },
        bannerDescription: { type: String, required: true },
        scrollDwonText: { type: String, required: true },
        bannerBottomText: { type: String, required: true },
        bannerBottomBtnText: { type: String, required: true },
        bannerBottomBtnLink: { type: String, required: true },
        bannerBackgroundImage: { type: String, required: true },

        // Intro Images
        introImages: {
            large: { type: String, required: true },
            medium: { type: String, required: true },
            small: { type: String, required: true },
        },
        introText: { type: String, required: true },

        // About Us Section
        aboutUsText: { type: String, required: true },
        aboutUsDescription: { type: String, required: true },
        aboutUsImage: { type: String, required: true },

        // Our Mission
        ourMissionText: { type: String, required: true },
        ourMissionDescription: { type: String, required: true },

        // Our Goals
        ourGoalsText: { type: String, required: true },
        ourGoalsDescription: { type: String, required: true },

        // Why Us
        whyUsText: { type: String, required: true },
        whyUsDescription: { type: String, required: true },

        // What We Offer
        whatWeOfferTitle: { type: String, required: true },
        whatWeOfferSubtitle: { type: String, required: true },
        whatWeOfferCurveIconWhite: { type: String, required: true },
        whatWeOfferCurveIconBlack: { type: String, required: true },
        whatWeOfferItems: { type: [String], required: true },

        // Team Info
        teamInfoTitle: { type: String, required: true },

        // About Us Analytics
        aboutUsAnalytics: {
            title: { type: String, required: true },
            subTitle: { type: String, required: true },
            teamMembers: { type: String, required: true },
            teamMembersText: { type: String, required: true },
            projectsCompleted: { type: String, required: true },
            projectsCompletedText: { type: String, required: true },
            growingRate: { type: String, required: true },
            growingRateText: { type: String, required: true },
            yearsOfExperience: { type: String, required: true },
            yearsOfExperienceText: { type: String, required: true },
        },

        // Our Clients
        ourClientsSectionBg: { type: String, required: true },

        // Bottom Text
        resumeeSendingText: { type: String, required: true },
        resumeeSendingEmail: { type: String, required: true },
        bottomTextLarge: { type: String, required: true },
        sections: { type: [aboutBlockSchema], default: [] },
    },
    {
        timestamps: false,
    }
);


const About = models.About || model<IAboutPage>('About', aboutPageSchema);
export default About;
