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
    testimonialsBg:string;

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
    allServiceBtnText:string;
    allProjectBtnText:string;

    // leaders section
    leadersSectionTitle:string;



    // team section
    teamSectionTitle:string;

    // home latest blog
    blogSectionTitle: {
        large: string;
        medium: string;
        small: string;
    };

    bottomSlider:string[];
}
