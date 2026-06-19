import mongoose from "mongoose";

const shouldRun = process.argv.includes("--run");

const brandDescription =
  "Webtricker is a web design and development agency offering professional websites, apps, and digital solutions.";

const hardcodedSameAs = [
  "https://www.facebook.com/webtricker",
  "https://x.com/webtricker",
  "https://www.linkedin.com/company/webtricker",
  "https://www.pinterest.com/webtricker",
  "https://www.instagram.com/webtricker",
];

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
};

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const mergeUnique = (values: unknown[], options?: { lowercase?: boolean }) => {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const value of values) {
    const cleaned = cleanText(value);
    if (!cleaned) continue;

    const normalized = options?.lowercase ? cleaned.toLowerCase() : cleaned;
    if (seen.has(normalized)) continue;

    seen.add(normalized);
    merged.push(normalized);
  }

  return merged;
};

const isUsPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1");
};

const orderPhonesByRegion = (phones: string[]) => [
  ...phones.filter(isUsPhone),
  ...phones.filter((phone) => !isUsPhone(phone)),
];

const platformFromUrl = (href: string) => {
  const normalized = href.toLowerCase();

  if (normalized.includes("facebook.com")) return "facebook";
  if (normalized.includes("x.com") || normalized.includes("twitter.com")) return "x";
  if (normalized.includes("linkedin.com")) return "linkedin";
  if (normalized.includes("pinterest.com")) return "pinterest";
  if (normalized.includes("instagram.com")) return "instagram";
  if (normalized.includes("youtube.com") || normalized.includes("youtu.be")) return "youtube";
  if (normalized.includes("reddit.com")) return "reddit";

  return "";
};

const mergeSocialLinks = (
  sources: { href?: unknown }[],
  extraUrls: string[]
) => {
  const byPlatform = new Map<string, { platform: string; href: string; isExternal: boolean }>();
  const orderedUrls = [
    ...sources.map((source) => cleanText(source.href)),
    ...extraUrls,
    "https://www.youtube.com/@Webtricker",
  ];

  for (const href of orderedUrls) {
    if (!href) continue;

    const platform = platformFromUrl(href);
    if (!platform || platform === "reddit" || byPlatform.has(platform)) continue;

    byPlatform.set(platform, {
      platform,
      href,
      isExternal: true,
    });
  }

  return Array.from(byPlatform.values()).sort((a, b) => {
    const order = ["facebook", "x", "linkedin", "pinterest", "instagram", "youtube"];
    return order.indexOf(a.platform) - order.indexOf(b.platform);
  });
};

const openingHoursForCountry = (country: string) => {
  if (country === "US") {
    return [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "19:00",
        timezone: "America/New_York",
      },
    ];
  }

  return [
    {
      days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "18:00",
      timezone: "Asia/Dhaka",
    },
  ];
};

const structureOffice = (office: { office?: string; location?: string }) => {
  const label = cleanText(office.office);
  const addressText = cleanText(office.location);
  const lowerLabel = label.toLowerCase();
  const lowerAddress = addressText.toLowerCase();

  if (lowerLabel.includes("us") || lowerAddress.includes("new jersey")) {
    return {
      label,
      country: "US",
      streetAddress: "971 US Highway 202N, Ste N",
      locality: "Branchburg",
      region: "NJ",
      postalCode: "08876",
      addressText,
      openingHours: openingHoursForCountry("US"),
    };
  }

  if (lowerAddress.includes("dhaka")) {
    return {
      label,
      country: "BD",
      streetAddress: "KHL Laboni's Dream, Plot-06, Afroza Begum Rd",
      locality: "Dhaka",
      region: "Dhaka",
      postalCode: "1229",
      addressText,
      openingHours: openingHoursForCountry("BD"),
    };
  }

  return {
    label,
    country: "BD",
    streetAddress: "House No-46, Zia College Moar, Beside Sohid Minar",
    locality: "Jamalpur",
    region: "Jamalpur",
    postalCode: "",
    addressText,
    openingHours: openingHoursForCountry("BD"),
  };
};

const seedSiteConfig = async () => {
  await connectToDatabase();

  const contactPagesCollection = mongoose.connection.collection("contactpages");
  const footersCollection = mongoose.connection.collection("footers");
  const sidebarsCollection = mongoose.connection.collection("sidebars");
  const topHeadersCollection = mongoose.connection.collection("topheaders");
  const siteConfigsCollection = mongoose.connection.collection("siteconfigs");

  const [contactPage, footer, sidebar, topHeader, existingSiteConfig] =
    await Promise.all([
      contactPagesCollection.findOne({}),
      footersCollection.findOne({}),
      sidebarsCollection.findOne({}),
      topHeadersCollection.findOne({}),
      siteConfigsCollection.findOne({}),
    ]);
  const siteConfigCount = await siteConfigsCollection.countDocuments({});

  if (!contactPage) throw new Error("ContactPage data was not found.");
  if (!footer) throw new Error("Footer data was not found.");
  if (!sidebar) throw new Error("Sidebar data was not found.");
  if (!topHeader) throw new Error("TopHeader data was not found.");
  if (siteConfigCount > 1) {
    throw new Error(
      `SiteConfig must be a singleton, but ${siteConfigCount} documents were found.`
    );
  }

  const phones = orderPhonesByRegion(
    mergeUnique([
      ...(contactPage.contactNumber?.numbers || []),
      ...(sidebar.information?.phones || []),
    ])
  );
  const emails = mergeUnique(
    [
      ...(contactPage.contactMails?.mails || []),
      ...(sidebar.information?.mails || []),
      ...(topHeader.contactLinks || [])
        .map((link) => cleanText(link.text))
        .filter((text) => text.includes("@")),
    ],
    { lowercase: true }
  );

  const footerSocials = footer.socialLinks?.links || [];
  const sidebarSocials = sidebar.socialLinks?.links || [];
  const topHeaderSocials = topHeader.socialLinks || [];
  const socialLinks = mergeSocialLinks(
    [...footerSocials, ...topHeaderSocials, ...sidebarSocials],
    hardcodedSameAs
  );
  const sameAs = socialLinks.map((link) => link.href);

  const offices = (contactPage.address?.addresses || []).map(structureOffice);

  const siteConfig = {
    brand: {
      name: "Webtricker",
      legalName: "Webtricker LLC",
      url: "https://webtricker.com",
      description: brandDescription,
      logo: "https://webtricker.com/logo.png",
      sameAs,
    },
    contact: {
      primaryEmail: emails[0] || "",
      emails,
      primaryPhone: phones[0] || "",
      phones,
    },
    offices,
    socialLinks,
    schemaConfig: {
      businessType: "ProfessionalService",
      organizationJsonLdEnabled: true,
    },
  };

  if (shouldRun) {
    const now = new Date();

    if (existingSiteConfig) {
      await siteConfigsCollection.updateOne(
        { _id: existingSiteConfig._id },
        {
          $set: {
            ...siteConfig,
            updatedAt: now,
          },
        }
      );
    } else {
      await siteConfigsCollection.insertOne({
        ...siteConfig,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: shouldRun ? "run" : "dry-run",
        existingSiteConfigFound: Boolean(existingSiteConfig),
        action: shouldRun
          ? existingSiteConfig
            ? "updated existing SiteConfig"
            : "created SiteConfig"
          : existingSiteConfig
            ? "would update existing SiteConfig"
            : "would create SiteConfig",
        sources: {
          contactPageId: String(contactPage._id),
          footerId: String(footer._id),
          sidebarId: String(sidebar._id),
          topHeaderId: String(topHeader._id),
        },
        exclusions: {
          reddit: "excluded by Phase 5 requirement",
        },
        mergedOutput: siteConfig,
      },
      null,
      2
    )
  );
};

seedSiteConfig()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Failed to seed site config:", error);
    await mongoose.disconnect();
    process.exit(1);
  });
