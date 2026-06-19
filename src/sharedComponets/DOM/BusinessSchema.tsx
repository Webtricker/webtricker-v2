type SiteConfigOffice = {
  label: string;
  country: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  addressText: string;
  openingHours?: {
    days: string[];
    opens: string;
    closes: string;
    timezone: string;
  }[];
};

type SiteConfig = {
  brand: {
    name: string;
    legalName: string;
    url: string;
    description: string;
    logo: string;
    sameAs: string[];
  };
  contact: {
    primaryEmail: string;
    primaryPhone: string;
  };
  offices: SiteConfigOffice[];
};

async function fetchSiteConfig(): Promise<SiteConfig | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/site-config`,
      // TEMP: revalidate=0 for active dev - RESET before launch (was: 86400)
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

const formatOpeningTime = (time: string, timezone: string) => {
  if (timezone === "Asia/Dhaka" && !time.includes("+")) return `${time}+06:00`;
  return time;
};

const mapOpeningHours = (office?: SiteConfigOffice) =>
  office?.openingHours?.map((hours) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.days,
    opens: formatOpeningTime(hours.opens, hours.timezone),
    closes: formatOpeningTime(hours.closes, hours.timezone),
  })) ?? [];

export default async function BusinessSchema() {
  const siteConfig = await fetchSiteConfig();
  if (!siteConfig) return null;

  const telephone: string | undefined =
    siteConfig.contact?.primaryPhone ?? undefined;
  const email: string | undefined = siteConfig.contact?.primaryEmail ?? undefined;

  const offices = siteConfig.offices ?? [];
  const primary =
    offices.find((office) => office.locality?.toLowerCase().includes("dhaka")) ??
    offices[0] ??
    undefined;
  const usOffice = offices.find((office) => office.country === "US");

  if (!telephone && !email && !primary) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.brand.name,
    legalName: siteConfig.brand.legalName,
    url: siteConfig.brand.url,
    logo: siteConfig.brand.logo,
    description: siteConfig.brand.description,
    ...(telephone && { telephone }),
    ...(email && { email }),
    ...(primary && {
      address: {
        "@type": "PostalAddress",
        streetAddress: primary.addressText,
        addressLocality: primary.locality,
        addressCountry: primary.country,
      },
    }),
    openingHoursSpecification: mapOpeningHours(primary),
    ...(usOffice && {
      location: {
        "@type": "LocalBusiness",
        name: `${siteConfig.brand.legalName} - ${usOffice.label}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: usOffice.streetAddress,
          addressLocality: usOffice.locality,
          addressRegion: usOffice.region,
          postalCode: usOffice.postalCode,
          addressCountry: usOffice.country,
        },
        openingHoursSpecification: mapOpeningHours(usOffice),
        ...(telephone && { telephone }),
      },
    }),
    sameAs: siteConfig.brand.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
