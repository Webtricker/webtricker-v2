import { getServicesData, getAllBlogSlugs } from "@/utils/pageData";

// /llms.txt: a plain-text map of the site for AI assistants and answer engines.
// Regenerated daily from the same data that feeds the sitemap.
export const revalidate = 86400;

const BASE = "https://webtricker.com";

const title = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export async function GET() {
  const [services, blogs] = await Promise.all([
    getServicesData().catch(() => []),
    getAllBlogSlugs().catch(() => []),
  ]);

  const serviceLines = ((services as { slug: string; title?: string }[]) || []).map(
    (s) => `- [${s.title || title(s.slug)}](${BASE}/services/${s.slug})`
  );
  const blogLines = ((blogs as { slug: string }[]) || [])
    .slice(0, 30)
    .map((b) => `- [${title(b.slug)}](${BASE}/blog/${b.slug})`);

  const body = `# Webtricker

> Webtricker LLC is a web design and development agency. We build fast, SEO-friendly websites, e-commerce stores, custom web apps and APIs, and provide technical SEO, maintenance and security services.

## Key pages

- [Home](${BASE}/): Overview of Webtricker and what we do
- [About](${BASE}/about): Mission, vision and team
- [Services](${BASE}/services): Everything we offer
- [Portfolio](${BASE}/portfolio): Selected client work
- [Blog](${BASE}/blog): Guides on web design, development, SEO and digital marketing
- [Training](${BASE}/training): Web design and development training programs
- [Free consultation](${BASE}/free-consultation): Book a free 30-minute call with our team
- [Contact](${BASE}/contact): Send us a message

## Services

${serviceLines.join("\n") || "- See " + BASE + "/services"}

## Recent articles

${blogLines.join("\n") || "- See " + BASE + "/blog"}

## Contact

- Book a call: ${BASE}/free-consultation
- Message us: ${BASE}/contact
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
