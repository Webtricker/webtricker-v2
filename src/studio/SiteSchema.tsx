import { getSiteConfig } from "./data";
import { BRAND, OFFICES, PHONES, SITE } from "./brand";

/* One @graph for the whole site: Organization, WebSite and three ProfessionalService nodes (US, Jamalpur, Dhaka).
   No aggregateRating: self-serving review markup is not eligible for rich results. */

const addr = (o: { streetAddress: string; locality: string; region: string; postalCode: string; country: string }) => ({
  "@type": "PostalAddress",
  streetAddress: o.streetAddress,
  addressLocality: o.locality,
  addressRegion: o.region,
  postalCode: o.postalCode,
  addressCountry: o.country,
});

const withOffset = (time: string, tz: string) => (tz === "Asia/Dhaka" && !time.includes("+") ? `${time}+06:00` : time);
const hoursFor = (offices: any[] | undefined, country: string, locality: string) => {
  const o = (offices || []).find((x) => x.country === country && String(x.locality || "").toLowerCase() === locality.toLowerCase());
  return (o?.openingHours || []).map((h: any) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days,
    opens: withOffset(h.opens, h.timezone),
    closes: withOffset(h.closes, h.timezone),
  }));
};

export default async function SiteSchema() {
  const site = await getSiteConfig().catch(() => null);
  const offices = (site as any)?.offices as any[] | undefined;
  const node = (id: string, name: string, phone: string, a: any, extra: Record<string, unknown>, hours: any[]) => ({
    "@type": "ProfessionalService",
    "@id": `${SITE}/#${id}`,
    name,
    url: SITE,
    image: BRAND.logo,
    telephone: phone,
    address: addr(a),
    hasMap: BRAND.mapsUrl,
    parentOrganization: { "@id": BRAND.orgId },
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    ...extra,
  });

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": BRAND.orgId,
        name: BRAND.legalName,
        alternateName: [BRAND.name, BRAND.bdName],
        url: SITE,
        logo: BRAND.logo,
        foundingDate: BRAND.foundingDate,
        description: "Web design and development agency building WordPress, WooCommerce, Shopify, Next.js and Laravel websites since 2014.",
        sameAs: BRAND.sameAs,
        contactPoint: [
          { "@type": "ContactPoint", telephone: PHONES.us.schema, contactType: "customer service", areaServed: "US", availableLanguage: ["English"] },
          { "@type": "ContactPoint", telephone: PHONES.bd.schema, contactType: "customer service", areaServed: "BD", availableLanguage: ["English", "Bengali"] },
        ],
      },
      {
        "@type": "WebSite",
        "@id": BRAND.siteId,
        url: SITE,
        name: BRAND.name,
        publisher: { "@id": BRAND.orgId },
        inLanguage: "en-US",
      },
      node("us", BRAND.legalName, PHONES.us.schema, OFFICES.us, { description: "Webtricker LLC, United States office in Branchburg, New Jersey." }, hoursFor(offices, "US", "Branchburg")),
      node("bd", BRAND.bdName, PHONES.bd.schema, OFFICES.bd, { description: "Webtricker Web Design & Development Agency, Bangladesh office in Jamalpur." }, hoursFor(offices, "BD", "Jamalpur")),
      node(
        "dhaka",
        `${BRAND.bdName} (Dhaka office)`,
        PHONES.bd.schema,
        OFFICES.dhaka,
        { description: "Meet our Dhaka support team and representative by appointment. Beside Rupayon Trade Center, Bashundhara." },
        hoursFor(offices, "BD", "Dhaka")
      ),
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
