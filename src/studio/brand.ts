/** Single source of truth for brand names, phone numbers, links and addresses (W-SEO-1). */
export const SITE = "https://webtricker.com";

export const BRAND = {
  url: SITE,
  orgId: `${SITE}/#org`,
  siteId: `${SITE}/#website`,
  name: "Webtricker",
  legalName: "Webtricker LLC",
  bdName: "Webtricker Web Design & Development Agency",
  foundingDate: "2014",
  /** Square mark (351x309) served from our own domain; falls back to nothing if the file is ever removed. */
  logo: "https://res.cloudinary.com/dnfvjnaki/image/upload/v1748526122/zfmkx1ssrfbtsiibeeze.png",
  mapsUrl: "https://www.google.com/maps?cid=2348630136509102554",
  reviewUrl: "https://g.page/r/Cdr5ZmOqApggEAI/review",
  sameAs: [
    "https://www.facebook.com/webtricker",
    "https://www.youtube.com/c/Webtricker/",
    "https://www.pinterest.com/webtricker/",
    "https://bd.linkedin.com/company/webtricker",
    "https://x.com/webtricker",
    "https://www.instagram.com/webtricker/",
    "https://www.google.com/maps?cid=2348630136509102554",
  ],
};

export const PHONES = {
  us: { region: "US", label: "United States", display: "+1 (908) 597-4947", tel: "+19085974947", schema: "+1-908-597-4947" },
  bd: { region: "BD", label: "Bangladesh", display: "+880 1712-377577", tel: "+8801712377577", schema: "+880-1712-377577" },
} as const;

export const OFFICES = {
  us: { streetAddress: "971 US Highway 202N, Ste N", locality: "Branchburg", region: "NJ", postalCode: "08876", country: "US" },
  bd: { streetAddress: "House No-46, Zia College Moar, Beside Sohid Minar", locality: "Jamalpur", region: "Jamalpur", postalCode: "2000", country: "BD" },
  dhaka: { streetAddress: "KHL Laboni's Dream, Plot-06, Afroza Begum Rd", locality: "Dhaka", region: "Dhaka", postalCode: "1229", country: "BD" },
} as const;
