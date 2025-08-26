export interface IHomePage {

    // banner section
    greeting: {
        top: string;
        bottom: string;
    };
    bannerText: {
        top: string;
        left: string;
        right: string;
    };

    bannerSpinningIconWhite: string;
    bannerSpinningIconBlack: string;
    bannerVideo: { type: "video" | "image", src: string };
    bannerDescription: string;

    // testimonials
    testimonialsBg: string;

    //   intro section
    introVideo: string;

    // clients section
    clientSectionSubtitle: string;

    // service section
    serviceSectionTitle: {
        large: string;
        medium: string;
        small: string;
    };
    allServiceBtnText: string;
    allProjectBtnText: string;

    // leaders section
    leadersSectionTitle: string;



    // team section
    teamSectionTitle: string;

    // home latest blog
    blogSectionTitle: {
        large: string;
        medium: string;
        small: string;
    };

    bottomSlider: string[];
}


export interface IAboutPage {

    // banner section
    bannerIntroText: {
        top: string;
        bottom: string;
    },
    bannerLargeText: string;
    bannerDescription: string;
    scrollDwonText: string;
    bannerBottomText: string;
    bannerBottomBtnText: string;
    bannerBottomBtnLink: string;
    bannerBackgroundImage: string;

    // intro images
    introImages: {
        large: string;
        medium: string;
        small: string;
    }
    introText: string;



    // about us section
    aboutUsText: string;
    aboutUsDescription: string;
    aboutUsImage: string;

    // our mission
    ourMissionText: string;
    ourMissionDescription: string;

    // our goals
    ourGoalsText: string;
    ourGoalsDescription: string;

    // why us 
    whyUsText: string;
    whyUsDescription: string;

    // what we offer
    whatWeOfferTitle: string;
    whatWeOfferSubtitle: string;
    whatWeOfferCurveIconWhite: string;
    whatWeOfferCurveIconBlack: string;

    // what we offer
    whatWeOfferItems: string[];

    // team info
    teamInfoTitle: string;

    // about us analytics
    aboutUsAnalytics: {
        title: string;
        subTitle: string;
        teamMembers: string;
        teamMembersText: string;
        projectsCompleted: string;
        projectsCompletedText: string;
        growingRate: string;
        growingRateText: string;
        yearsOfExperience: string;
        yearsOfExperienceText: string;
    };

    // Our Clients
    ourClientsSectionBg: string;

    // bottom text
    resumeeSendingText: string;
    resumeeSendingEmail: string;
    bottomTextLarge: string;
}


type BottomText = {
    expression: string;
    title: string;
}


export interface IServicesPage {
    banner: {
        title: string;
        description: string;
    }
    bannerBG: {
        type: "image" | "video";
        src: string;
    };
    servicesShotcut: {
        iconWhite: string;
        iconBlack: string;
        title: string;
        subtitle: string;
    },
    bottomText: BottomText
}


export interface IPortfolioPage {
    bannerSlider: {
        img: string;
        technology: string;
        name: string;
        _id?:string;
    }[];
    projectIntroduction: {
        companyName: string;
        title: string;
        description: string;
    };
    bottomText: BottomText
}

export interface IBlogPage {
    bannerBG: {
        type: "image" | "video";
        src: string;
    };
    title: string;
    description: string;
}

