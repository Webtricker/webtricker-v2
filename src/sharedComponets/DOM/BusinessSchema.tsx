const SITE_URL = "https://webtricker.com";

const SAME_AS = [
  "https://www.facebook.com/webtricker",
  "https://x.com/webtricker",
  "https://www.linkedin.com/company/webtricker",
  "https://www.pinterest.com/webtricker",
  "https://www.instagram.com/webtricker",
];

// NJ registered office — hardcoded from Certificate of Formation (05/22/2026)
const NJ_OFFICE = {
  "@type": "LocalBusiness",
  name: "Webtricker LLC - US Office",
  address: {
    "@type": "PostalAddress",
    streetAddress: "971 US Highway 202N, Ste N",
    addressLocality: "Branchburg",
    addressRegion: "NJ",
    postalCode: "08876",
    addressCountry: "US",
  },
  // Bare local times (no UTC offset) — schema.org parsers interpret these
  // as Eastern Time for the stated US address, which handles EST/EDT naturally.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
};

async function fetchContactData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/contact-page`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export default async function BusinessSchema() {
  const data = await fetchContactData();
  if (!data) return null;

  const telephone: string | undefined =
    data?.contactNumber?.numbers?.[0] ?? undefined;
  const email: string | undefined =
    data?.contactMails?.mails?.[0] ?? undefined;

  // Prefer the first office whose location contains "Dhaka"; fall back to index 0.
  const offices: { office: string; location: string }[] =
    data?.address?.addresses ?? [];
  const primary =
    offices.find((a) => a.location?.toLowerCase().includes("dhaka")) ??
    offices[0] ??
    undefined;

  if (!telephone && !email && !primary) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Webtricker",
    legalName: "Webtricker LLC",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Webtricker is a web design and development agency offering professional websites, apps, and digital solutions.",
    ...(telephone && { telephone }),
    ...(email && { email }),
    ...(primary && {
      address: {
        "@type": "PostalAddress",
        streetAddress: primary.location,
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
    }),
    // BD offices: Saturday–Thursday, Asia/Dhaka (UTC+6, no DST — fixed offset is accurate)
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "09:00+06:00",
        closes: "18:00+06:00",
      },
    ],
    // NJ registered office with its own US calling hours
    location: NJ_OFFICE,
    sameAs: SAME_AS,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
