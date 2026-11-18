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

/* ---------------------------------------------------------------------------------------------
   Backend first: phone numbers, social profiles and office addresses are edited in the dashboard
   (Settings > Site Config) and stored in the database. The constants above are only the fallback
   used when the API is unreachable or a field is empty, so nothing on the site depends on them.
--------------------------------------------------------------------------------------------- */
export type PhoneInfo = { region: string; label: string; display: string; tel: string; schema: string };

type SiteLike = {
  contact?: { primaryPhone?: string; phones?: string[] };
  socialLinks?: { href?: string }[];
  brand?: { sameAs?: string[] };
  offices?: { country?: string; locality?: string; streetAddress?: string; region?: string; postalCode?: string }[];
} | null | undefined;

const digitsOf = (raw: string) => raw.replace(/[^\d+]/g, "");

const toPhone = (raw: string | undefined, fallback: PhoneInfo): PhoneInfo => {
  const clean = raw ? digitsOf(raw) : "";
  if (!clean.startsWith("+") || clean.length < 9) return fallback;
  const d = clean.slice(1);
  if (clean.startsWith("+1") && d.length === 11) {
    return { ...fallback, tel: clean, display: `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`, schema: `+1-${d.slice(1, 4)}-${d.slice(4, 7)}-${d.slice(7)}` };
  }
  if (clean.startsWith("+880") && d.length === 13) {
    return { ...fallback, tel: clean, display: `+880 ${d.slice(3, 7)}-${d.slice(7)}`, schema: `+880-${d.slice(3, 7)}-${d.slice(7)}` };
  }
  return { ...fallback, tel: clean, display: raw!.trim(), schema: clean };
};

/** US and Bangladesh numbers from Site Config (primary phone, and the first +880 number in the list). */
export const resolvePhones = (site: SiteLike): { us: PhoneInfo; bd: PhoneInfo } => {
  const list = [site?.contact?.primaryPhone, ...(site?.contact?.phones ?? [])].filter(Boolean) as string[];
  const us = list.find((p) => digitsOf(p).startsWith("+1"));
  const bd = list.find((p) => digitsOf(p).startsWith("+880"));
  return { us: toPhone(us, PHONES.us), bd: toPhone(bd, PHONES.bd) };
};

/** Social profile URLs from Site Config (plus the Google Maps listing), else the built-in list. */
export const resolveSameAs = (site: SiteLike): string[] => {
  const links = (site?.socialLinks ?? []).map((s) => s.href).filter((h): h is string => !!h && /^https?:\/\//.test(h));
  const base = links.length ? links : (site?.brand?.sameAs ?? []).filter((h) => /^https?:\/\//.test(h));
  return base.length ? Array.from(new Set([...base, BRAND.mapsUrl])) : BRAND.sameAs;
};

type OfficeAddr = { streetAddress: string; locality: string; region: string; postalCode: string; country: string };
/** Postal address of an office from Site Config, falling back to the built-in address. */
export const resolveOffice = (site: SiteLike, key: keyof typeof OFFICES): OfficeAddr => {
  const fb = OFFICES[key];
  const o = (site?.offices ?? []).find((x) => x.country === fb.country && String(x.locality || "").toLowerCase() === fb.locality.toLowerCase());
  if (!o?.streetAddress) return { ...fb };
  return { streetAddress: o.streetAddress, locality: fb.locality, region: o.region || fb.region, postalCode: o.postalCode || fb.postalCode, country: fb.country };
};
