import type {
  SeoConfigThresholds,
  SeoConfigWeights,
} from "@/models/SeoConfig";

export type SeoCheck = {
  key: string;
  label: string;
  category: "basicSeo" | "contentQuality" | "linksStructure" | "aeo" | "geo";
  pass: boolean;
  /** raw points earned within the fixed 100-pt pool */
  earned: number;
  /** max points this check can contribute */
  max: number;
};

export type SeoScoreResult = {
  score: number;
  checks: SeoCheck[];
};

export type SeoInput = {
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  content?: string;
  author?: string;
  updatedAt?: Date | string | null;
};

/** Minimal DOM surface the scorer actually uses — satisfied by both
 *  DOMParser (browser) and node-html-parser (Node.js backfill script). */
export type ParsedDoc = {
  body: { textContent: string };
  querySelectorAll(
    selector: string
  ): ArrayLike<{ getAttribute(attr: string): string | null; textContent: string }>;
  querySelector(selector: string): { textContent: string } | null;
};

// Each category's internal max points must equal the default weight.
// When admin changes a category weight, individual check maxes scale proportionally.
const CATEGORY_INTERNAL_MAX = {
  basicSeo: 35,
  contentQuality: 20,
  linksStructure: 10,
  aeo: 20,
  geo: 15,
} as const;

function defaultParseHtml(html: string): ParsedDoc {
  return new DOMParser().parseFromString(html || "", "text/html");
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export function scoreSeo(
  data: SeoInput,
  weights: SeoConfigWeights,
  thresholds: SeoConfigThresholds,
  brandName: string,
  parseHtml: (html: string) => ParsedDoc = defaultParseHtml
): SeoScoreResult {
  const doc = parseHtml(data.content || "");
  const bodyText = doc.body.textContent || "";
  const wordCount = countWords(bodyText);
  const keyword = (data.focusKeyword || "").toLowerCase().trim();
  const seoTitleLen = (data.seoTitle || "").length;
  const metaDescLen = (data.seoDescription || "").length;

  const raw: Omit<SeoCheck, "earned" | "max">[] = [];
  const rawPoints: { pass: boolean; internalMax: number; partial?: number }[] = [];

  // ── Basic SEO: 35 pts (7+7+7+7+4+3) ──────────────────────────────
  const kwSet = keyword.length > 0;
  raw.push({ key: "keyword", label: "Focus keyword set", category: "basicSeo", pass: kwSet });
  rawPoints.push({ pass: kwSet, internalMax: 7 });

  const kwInTitle = kwSet && (data.seoTitle || "").toLowerCase().includes(keyword);
  raw.push({ key: "kwInTitle", label: "Focus keyword in SEO title", category: "basicSeo", pass: kwInTitle });
  rawPoints.push({ pass: kwInTitle, internalMax: 7 });

  const titleLenOk =
    seoTitleLen >= thresholds.minSeoTitleLength &&
    seoTitleLen <= thresholds.maxSeoTitleLength;
  raw.push({
    key: "titleLen",
    label: `SEO title ${thresholds.minSeoTitleLength}–${thresholds.maxSeoTitleLength} chars (current: ${seoTitleLen})`,
    category: "basicSeo",
    pass: titleLenOk,
  });
  rawPoints.push({ pass: titleLenOk, internalMax: 7 });

  const descLenOk =
    metaDescLen >= thresholds.minMetaDescLength &&
    metaDescLen <= thresholds.maxMetaDescLength;
  raw.push({
    key: "descLen",
    label: `Meta description ${thresholds.minMetaDescLength}–${thresholds.maxMetaDescLength} chars (current: ${metaDescLen})`,
    category: "basicSeo",
    pass: descLenOk,
  });
  rawPoints.push({ pass: descLenOk, internalMax: 7 });

  const hasCanonical = !!(data.canonicalUrl || "").trim();
  raw.push({ key: "canonical", label: "Canonical URL set", category: "basicSeo", pass: hasCanonical });
  rawPoints.push({ pass: hasCanonical, internalMax: 4 });

  const hasOgImage = !!(data.ogImage || "").trim();
  raw.push({ key: "ogImage", label: "OG / social image set", category: "basicSeo", pass: hasOgImage });
  rawPoints.push({ pass: hasOgImage, internalMax: 3 });

  // ── Content Quality: 20 pts (10+4+6) ─────────────────────────────
  const wordFull = wordCount >= thresholds.goodWordCount;
  const wordPartial = wordCount >= thresholds.minWordCount;
  const wordEarnedRatio = wordFull ? 1 : wordPartial ? 0.5 : 0;
  raw.push({
    key: "wordCount",
    label: `Content length: ${wordCount} words (target ≥ ${thresholds.goodWordCount})`,
    category: "contentQuality",
    pass: wordFull,
  });
  rawPoints.push({ pass: wordFull, internalMax: 10, partial: wordEarnedRatio });

  const hasH2 = doc.querySelectorAll("h2").length > 0;
  raw.push({ key: "hasH2", label: "H2 headings present", category: "contentQuality", pass: hasH2 });
  rawPoints.push({ pass: hasH2, internalMax: 4 });

  const images = Array.from(doc.querySelectorAll("img"));
  const allImgsHaveAlt =
    images.length === 0 ||
    images.every((img) => (img.getAttribute("alt") || "").trim().length > 0);
  raw.push({
    key: "imgAlt",
    label: "All inline images have alt text",
    category: "contentQuality",
    pass: allImgsHaveAlt,
  });
  rawPoints.push({ pass: allImgsHaveAlt, internalMax: 6 });

  // ── Links & Structure: 10 pts (4+3+3) ────────────────────────────
  const links = Array.from(doc.querySelectorAll("a[href]"));

  const hasInternal = links.some((a) => {
    const href = a.getAttribute("href") || "";
    return href.startsWith("/") || href.startsWith("#");
  });
  raw.push({ key: "internalLinks", label: "Internal links present", category: "linksStructure", pass: hasInternal });
  rawPoints.push({ pass: hasInternal, internalMax: 4 });

  const hasExternal = links.some((a) => {
    const href = a.getAttribute("href") || "";
    return href.startsWith("http") || href.startsWith("//");
  });
  raw.push({ key: "externalLinks", label: "External links present", category: "linksStructure", pass: hasExternal });
  rawPoints.push({ pass: hasExternal, internalMax: 3 });

  const hasH3 = doc.querySelectorAll("h3").length > 0;
  raw.push({ key: "headingVariety", label: "H3 subheadings present", category: "linksStructure", pass: hasH3 });
  rawPoints.push({ pass: hasH3, internalMax: 3 });

  // ── AEO: 20 pts (5+5+5+5) ────────────────────────────────────────
  const headingTexts = Array.from(doc.querySelectorAll("h2, h3")).map(
    (h) => h.textContent || ""
  );

  const hasQA = headingTexts.some((t) => t.includes("?"));
  raw.push({ key: "qaHeadings", label: "Question headings (H2/H3 with ?)", category: "aeo", pass: hasQA });
  rawPoints.push({ pass: hasQA, internalMax: 5 });

  const firstP = doc.querySelector("p");
  const firstPWords = firstP ? countWords(firstP.textContent || "") : 0;
  const firstPPass = firstPWords >= thresholds.firstParaMinWords;
  raw.push({
    key: "firstPara",
    label: `First paragraph ≥ ${thresholds.firstParaMinWords} words (current: ${firstPWords})`,
    category: "aeo",
    pass: firstPPass,
  });
  rawPoints.push({ pass: firstPPass, internalMax: 5 });

  const hasFaq = headingTexts.some((t) => /faq|frequently asked/i.test(t));
  raw.push({ key: "faqSection", label: "FAQ section present", category: "aeo", pass: hasFaq });
  rawPoints.push({ pass: hasFaq, internalMax: 5 });

  const tldrPass = firstPWords > 0 && firstPWords <= thresholds.tldrMaxWords;
  raw.push({
    key: "tldr",
    label: `Concise opener ≤ ${thresholds.tldrMaxWords} words (current: ${firstPWords})`,
    category: "aeo",
    pass: tldrPass,
  });
  rawPoints.push({ pass: tldrPass, internalMax: 5 });

  // ── GEO: 15 pts (5+2+4+4) ────────────────────────────────────────
  const hasAuthor = !!(data.author || "").trim();
  raw.push({ key: "author", label: "Author credited", category: "geo", pass: hasAuthor });
  rawPoints.push({ pass: hasAuthor, internalMax: 5 });

  let fresh = false;
  if (data.updatedAt) {
    const updated = new Date(data.updatedAt as string);
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - thresholds.freshnessMonths);
    fresh = !isNaN(updated.getTime()) && updated > cutoff;
  }
  raw.push({
    key: "freshness",
    label: `Updated within ${thresholds.freshnessMonths} months`,
    category: "geo",
    pass: fresh,
  });
  rawPoints.push({ pass: fresh, internalMax: 2 });

  const brandLower = (brandName || "").toLowerCase();
  const hasBrand =
    brandLower.length > 0 && bodyText.toLowerCase().includes(brandLower);
  raw.push({
    key: "brand",
    label: `Brand name "${brandName}" mentioned in content`,
    category: "geo",
    pass: hasBrand,
  });
  rawPoints.push({ pass: hasBrand, internalMax: 4 });

  // Citation-worthy specificity: digits/numbers ≥3 matches
  const specificityMatches = bodyText.match(/\d+%|\d+\+|\$\d+|\d{2,}/g) || [];
  const hasSpecificity = specificityMatches.length >= 3;
  raw.push({
    key: "specificity",
    label: `Concrete stats / numbers ≥ 3 specific claims (found: ${specificityMatches.length})`,
    category: "geo",
    pass: hasSpecificity,
  });
  rawPoints.push({ pass: hasSpecificity, internalMax: 4 });

  // ── Compute weighted score ────────────────────────────────────────
  // Each check earns points scaled by the admin-configured category weight.
  // earned = (earnedRatio) × (internalMax / categoryDefaultMax) × configuredWeight
  const checks: SeoCheck[] = raw.map((item, i) => {
    const rp = rawPoints[i];
    const catMax = CATEGORY_INTERNAL_MAX[item.category];
    const configuredWeight = weights[item.category] ?? catMax;
    const earnedRatio =
      rp.partial !== undefined
        ? rp.partial
        : rp.pass
        ? 1
        : 0;
    const scaledMax = (rp.internalMax / catMax) * configuredWeight;
    const earned = earnedRatio * scaledMax;
    return {
      ...item,
      earned: Math.round(earned * 10) / 10,
      max: Math.round(scaledMax * 10) / 10,
    };
  });

  const score = Math.min(
    100,
    Math.round(checks.reduce((sum, c) => sum + c.earned, 0))
  );

  return { score, checks };
}
