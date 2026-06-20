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

const buildHomeSections = (home) => [
  block("home-hero", "hero", 10, {
    greeting: home.greeting,
    bannerText: home.bannerText,
    bannerSpinningIconWhite: home.bannerSpinningIconWhite,
    bannerSpinningIconBlack: home.bannerSpinningIconBlack,
    bannerVideo: home.bannerVideo,
    bannerDescription: home.bannerDescription,
    cta: {
      label: "Let's talk",
      href: "/contact",
    },
  }),
  block("home-media-intro", "mediaIntro", 20, {
    introVideo: home.introVideo,
  }),
  block("home-logo-marquee", "logoMarquee", 30, {
    title: home.clientSectionSubtitle,
    clientsBanners: home.clientsBanners || [],
  }),
  block("home-testimonials", "testimonialSlider", 40, {
    sectionBg: home.testimonialsBg,
    collection: "testimonials",
  }),
  block("home-technologies", "technologyGrid", 50, {
    title: home.technologoySectionTitle,
    technologies: home.technologies || [],
  }),
  block("home-services", "collectionPreview", 60, {
    collection: "services",
    variant: "homeServices",
    serviceSectionTitle: home.serviceSectionTitle,
    allServiceBtnText: home.allServiceBtnText,
    href: "/services",
  }),
  block("home-large-marquee", "marquee", 70, {
    variant: "largeMarquee",
  }),
  block("home-portfolio-showcase", "portfolioShowcase", 80, {
    collection: "portfolios",
    range: {
      start: 0,
      end: 6,
    },
  }),
  block("home-portfolio-slider", "portfolioSlider", 90, {
    collection: "portfolios",
    range: {
      start: 6,
      end: 12,
    },
    visibleWhen: {
      secondSixPortfoliosLengthGreaterThan: 5,
    },
    linkText: home.allProjectBtnText,
    href: "/portfolio",
  }),
  block("home-leaders", "leaderGrid", 100, {
    collection: "leader",
    title: home.leadersSectionTitle,
  }),
  block("home-team", "teamSlider", 110, {
    collection: "teams",
    title: home.teamSectionTitle,
  }),
  block("home-latest-blogs", "collectionPreview", 120, {
    collection: "posts",
    variant: "latestBlogs",
    limit: 4,
    blogSectionTitle: home.blogSectionTitle,
  }),
  block("home-image-feed", "imageFeed", 130, {
    images: home.bottomSlider || [],
  }),
];

const main = async () => {
  loadEnvLocal();
  const shouldRun = process.argv.includes("--run");

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const homesCollection = mongoose.connection.collection("homes");
  const home = await homesCollection.findOne({});

  if (!home) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          error: "No Home document found.",
        },
        null,
        2
      )
    );
    return;
  }

  const sections = buildHomeSections(home);
  const existingSectionsCount = Array.isArray(home.sections)
    ? home.sections.length
    : 0;

  if (shouldRun) {
    await homesCollection.updateOne(
      { _id: home._id },
      {
        $set: {
          sections,
        },
      }
    );

    const updatedHome = await homesCollection.findOne(
      { _id: home._id },
      {
        projection: {
          sections: 1,
          greeting: 1,
          bannerText: 1,
          bannerDescription: 1,
          introVideo: 1,
          clientsBanners: 1,
          technologies: 1,
          bottomSlider: 1,
        },
      }
    );

    console.log(
      JSON.stringify(
        {
          dryRun: false,
          wrote: true,
          homeId: String(home._id),
          previousSectionsCount: existingSectionsCount,
          writtenSectionsCount: Array.isArray(updatedHome?.sections)
            ? updatedHome.sections.length
            : 0,
          fixedFieldsStillPresent: {
            greeting: Boolean(updatedHome?.greeting),
            bannerText: Boolean(updatedHome?.bannerText),
            bannerDescription: Boolean(updatedHome?.bannerDescription),
            introVideo: Boolean(updatedHome?.introVideo),
            clientsBanners: Array.isArray(updatedHome?.clientsBanners),
            technologies: Array.isArray(updatedHome?.technologies),
            bottomSlider: Array.isArray(updatedHome?.bottomSlider),
          },
          sections: updatedHome?.sections || [],
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
        homeId: String(home._id),
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
    console.error("Failed to generate Home sections dry-run:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
