{
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const loadEnvLocal = () => {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) process.env[key] = value;
  }
};

const block = (id, type, order, data = {}) => ({
  id,
  type,
  order,
  visible: true,
  data,
});

const buildAboutSections = (about) => [
  block("about-hero", "aboutHero", 10, {
    bannerIntroText: about.bannerIntroText,
    bannerLargeText: about.bannerLargeText,
    bannerDescription: about.bannerDescription,
    scrollDwonText: about.scrollDwonText,
    bannerBottomText: about.bannerBottomText,
    bannerBottomBtnText: about.bannerBottomBtnText,
    bannerBottomBtnLink: about.bannerBottomBtnLink,
    bannerBackgroundImage: about.bannerBackgroundImage,
  }),
  block("about-gallery", "aboutGallery", 20, {
    introImages: about.introImages,
  }),
  block("about-intro-text", "aboutIntroText", 30, {
    introText: about.introText,
  }),
  block("about-story", "aboutStory", 40, {
    aboutUsText: about.aboutUsText,
    aboutUsDescription: about.aboutUsDescription,
    aboutUsImage: about.aboutUsImage,
    ourMissionText: about.ourMissionText,
    ourMissionDescription: about.ourMissionDescription,
    ourGoalsText: about.ourGoalsText,
    ourGoalsDescription: about.ourGoalsDescription,
    whyUsText: about.whyUsText,
    whyUsDescription: about.whyUsDescription,
  }),
  block("about-what-we-offer", "whatWeOffer", 50, {
    whatWeOfferTitle: about.whatWeOfferTitle,
    whatWeOfferSubtitle: about.whatWeOfferSubtitle,
    whatWeOfferCurveIconWhite: about.whatWeOfferCurveIconWhite,
    whatWeOfferCurveIconBlack: about.whatWeOfferCurveIconBlack,
    whatWeOfferItems: about.whatWeOfferItems || [],
  }),
  block("about-team", "teamSlider", 60, {
    collection: "teams",
    title: about.teamInfoTitle,
  }),
  block("about-fun-facts", "funFacts", 70, {
    aboutUsAnalytics: about.aboutUsAnalytics,
  }),
  block("about-testimonials", "testimonialSlider", 80, {
    collection: "testimonials",
    sectionBg: about.ourClientsSectionBg,
  }),
  block("about-resume-cta", "resumeCta", 90, {
    resumeeSendingText: about.resumeeSendingText,
    resumeeSendingEmail: about.resumeeSendingEmail,
    bottomTextLarge: about.bottomTextLarge,
  }),
];

const main = async () => {
  loadEnvLocal();
  const shouldRun = process.argv.includes("--run");

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const aboutCollection = mongoose.connection.collection("abouts");
  const about = await aboutCollection.findOne({});

  if (!about) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          error: "No About document found.",
        },
        null,
        2
      )
    );
    return;
  }

  const sections = buildAboutSections(about);
  const existingSectionsCount = Array.isArray(about.sections)
    ? about.sections.length
    : 0;

  if (shouldRun) {
    await aboutCollection.updateOne(
      { _id: about._id },
      {
        $set: {
          sections,
        },
      }
    );

    const updatedAbout = await aboutCollection.findOne(
      { _id: about._id },
      {
        projection: {
          sections: 1,
          bannerIntroText: 1,
          bannerLargeText: 1,
          bannerDescription: 1,
          introImages: 1,
          introText: 1,
          aboutUsText: 1,
          aboutUsImage: 1,
          whatWeOfferItems: 1,
          teamInfoTitle: 1,
          aboutUsAnalytics: 1,
          ourClientsSectionBg: 1,
          resumeeSendingText: 1,
          resumeeSendingEmail: 1,
          bottomTextLarge: 1,
        },
      }
    );

    console.log(
      JSON.stringify(
        {
          dryRun: false,
          wrote: true,
          aboutId: String(about._id),
          previousSectionsCount: existingSectionsCount,
          writtenSectionsCount: Array.isArray(updatedAbout?.sections)
            ? updatedAbout.sections.length
            : 0,
          fixedFieldsStillPresent: {
            bannerIntroText: Boolean(updatedAbout?.bannerIntroText),
            bannerLargeText: Boolean(updatedAbout?.bannerLargeText),
            bannerDescription: Boolean(updatedAbout?.bannerDescription),
            introImages: Boolean(updatedAbout?.introImages),
            introText: Boolean(updatedAbout?.introText),
            aboutUsText: Boolean(updatedAbout?.aboutUsText),
            aboutUsImage: Boolean(updatedAbout?.aboutUsImage),
            whatWeOfferItems: Array.isArray(updatedAbout?.whatWeOfferItems),
            teamInfoTitle: Boolean(updatedAbout?.teamInfoTitle),
            aboutUsAnalytics: Boolean(updatedAbout?.aboutUsAnalytics),
            ourClientsSectionBg: Boolean(updatedAbout?.ourClientsSectionBg),
            resumeeSendingText: Boolean(updatedAbout?.resumeeSendingText),
            resumeeSendingEmail: Boolean(updatedAbout?.resumeeSendingEmail),
            bottomTextLarge: Boolean(updatedAbout?.bottomTextLarge),
          },
          sections: updatedAbout?.sections || [],
        },
        null,
        2
      )
    );
    return;
  }

  console.log(
    JSON.stringify(
      {
        dryRun: true,
        wouldWrite: false,
        aboutId: String(about._id),
        existingSectionsCount,
        generatedSectionsCount: sections.length,
        sections,
      },
      null,
      2
    )
  );
};

main()
  .catch((error) => {
    console.error("Failed to generate About sections dry-run:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
}
