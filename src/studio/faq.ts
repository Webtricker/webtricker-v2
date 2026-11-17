/** Pull the visible "Frequently Asked Questions" block (Q:/A: paragraphs) out of a CMS body, so the FAQPage markup equals the on-page text. */
const ENT: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "\u2019", lsquo: "\u2018", rdquo: "\u201d", ldquo: "\u201c", ndash: "\u2013", mdash: "\u2014", hellip: "\u2026" };
const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const plain = (h: string) => decode(h.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

export function extractFaqs(html?: string): { q: string; a: string }[] {
  if (!html) return [];
  const heads = [...html.matchAll(/<h[1-6][^>]*>\s*(?:<[^>]+>)*\s*Frequently Asked Questions/gi)];
  if (!heads.length) return [];
  const seg = html.slice((heads[heads.length - 1].index ?? 0) + 1).replace(/^[^]*?<\/h[1-6]>/i, "");
  const out: { q: string; a: string }[] = [];
  let q = "";
  for (const m of seg.matchAll(/<p[^>]*>([^]*?)<\/p>/gi)) {
    const t = plain(m[1]);
    if (/^Q:\s*/i.test(t)) q = t.replace(/^Q:\s*/i, "");
    else if (/^A:\s*/i.test(t) && q) { out.push({ q, a: t.replace(/^A:\s*/i, "") }); q = ""; }
  }
  return out;
}
