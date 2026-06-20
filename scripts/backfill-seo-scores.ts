/**
 * One-time backfill script: computes and (optionally) writes seoScore for all
 * existing Blog Posts, Services, and Portfolio items.
 *
 * Usage:
 *   pnpm backfill-seo             # dry-run — prints report, no DB writes
 *   pnpm backfill-seo --write     # writes scores after dry-run approval
 *
 * Run from the project root; reads MONGODB_URI from .env.local automatically
 * via tsx's --env-file flag (see package.json script).
 */

import mongoose from "mongoose";
import { parse as parseHtml } from "node-html-parser";

// ── Inlined types to avoid @/ path resolution in Node context ──────────────

type SeoConfigWeights = {
  basicSeo: number;
  contentQuality: number;
  linksStructure: number;
  aeo: number;
  geo: number;
};

type SeoConfigThresholds = {
  minWordCount: number;
  goodWordCount: number;
  minSeoTitleLength: number;
  maxSeoTitleLength: number;
  minMetaDescLength: number;
  maxMetaDescLength: number;
  firstParaMinWords: number;
  tldrMaxWords: number;
  freshnessMonths: number;
};

// ── Import scoreSeo with path alias resolved via tsconfig paths ────────────
// tsx + tsconfig-paths handles @/ → src/ resolution automatically.
import { scoreSeo, type ParsedDoc } from "../src/dashboard/seo/scoreSeo";

// ── node-html-parser adapter matching ParsedDoc interface ──────────────────

function nodeParseHtml(html: string): ParsedDoc {
  const root = parseHtml(html || "");
  return {
    body: {
      get textContent() {
        return root.textContent;
      },
    },
    querySelectorAll(selector: string) {
      return root.querySelectorAll(selector) as any;
    },
    querySelector(selector: string) {
      return root.querySelector(selector) as any;
    },
  };
}

// ── Mongoose schemas (minimal — only fields the scorer reads) ──────────────

const seoFields = {
  seoTitle: String,
  seoDescription: String,
  focusKeyword: String,
  canonicalUrl: String,
  ogImage: String,
  content: String,
  author: String,
  seoScore: Number,
};

const PostModel =
  mongoose.models.Post ||
  mongoose.model(
    "Post",
    new mongoose.Schema(
      { title: String, slug: String, postType: String, ...seoFields },
      { timestamps: true }
    )
  );

const ServiceModel =
  mongoose.models.Service ||
  mongoose.model(
    "Service",
    new mongoose.Schema(
      { title: String, slug: String, ...seoFields },
      { timestamps: true }
    )
  );

const PortfolioModel =
  mongoose.models.Portfolio ||
  mongoose.model(
    "Portfolio",
    new mongoose.Schema(
      { title: String, slug: String, ...seoFields },
      { timestamps: true }
    )
  );

const SeoConfigModel =
  mongoose.models.SeoConfig ||
  mongoose.model(
    "SeoConfig",
    new mongoose.Schema({
      weights: {
        basicSeo:       { type: Number, default: 35 },
        contentQuality: { type: Number, default: 20 },
        linksStructure: { type: Number, default: 10 },
        aeo:            { type: Number, default: 20 },
        geo:            { type: Number, default: 15 },
      },
      thresholds: {
        minWordCount:      { type: Number, default: 300 },
        goodWordCount:     { type: Number, default: 600 },
        minSeoTitleLength: { type: Number, default: 30 },
        maxSeoTitleLength: { type: Number, default: 60 },
        minMetaDescLength: { type: Number, default: 120 },
        maxMetaDescLength: { type: Number, default: 160 },
        firstParaMinWords: { type: Number, default: 20 },
        tldrMaxWords:      { type: Number, default: 50 },
        freshnessMonths:   { type: Number, default: 6 },
      },
    })
  );

const SiteConfigModel =
  mongoose.models.SiteConfig ||
  mongoose.model(
    "SiteConfig",
    new mongoose.Schema({
      brand: { name: { type: String, default: "Webtricker" } },
    })
  );

// ── Helpers ────────────────────────────────────────────────────────────────

const DEFAULT_WEIGHTS: SeoConfigWeights = {
  basicSeo: 35, contentQuality: 20, linksStructure: 10, aeo: 20, geo: 15,
};
const DEFAULT_THRESHOLDS: SeoConfigThresholds = {
  minWordCount: 300, goodWordCount: 600,
  minSeoTitleLength: 30, maxSeoTitleLength: 60,
  minMetaDescLength: 120, maxMetaDescLength: 160,
  firstParaMinWords: 20, tldrMaxWords: 50, freshnessMonths: 6,
};

function band(score: number): string {
  if (score >= 80) return "🟢 Good";
  if (score >= 51) return "🟡 Needs work";
  return "🔴 Poor";
}

function pad(str: string, len: number): string {
  return str.length >= len ? str.slice(0, len - 1) + "…" : str.padEnd(len);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const writeMode = process.argv.includes("--write");

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI is not set. Make sure .env.local is loaded.");
    process.exit(1);
  }

  console.log(`\nConnecting to MongoDB…`);
  await mongoose.connect(uri);
  console.log("Connected.\n");

  // ── Fetch config ──────────────────────────────────────────────────────────
  const seoConfigDoc = await SeoConfigModel.findOne().lean();
  const siteConfigDoc = await SiteConfigModel.findOne().lean() as any;

  const weights: SeoConfigWeights = (seoConfigDoc as any)?.weights ?? DEFAULT_WEIGHTS;
  const thresholds: SeoConfigThresholds = (seoConfigDoc as any)?.thresholds ?? DEFAULT_THRESHOLDS;
  const brandName: string = siteConfigDoc?.brand?.name ?? "Webtricker";

  console.log(`Config loaded — brand: "${brandName}"`);
  console.log(`Weights: basicSeo=${weights.basicSeo} contentQuality=${weights.contentQuality} linksStructure=${weights.linksStructure} aeo=${weights.aeo} geo=${weights.geo}\n`);

  // ── Fetch items ───────────────────────────────────────────────────────────
  const [blogs, services, portfolios] = await Promise.all([
    PostModel.find({ postType: "blog" }).lean(),
    ServiceModel.find({}).lean(),
    PortfolioModel.find({}).lean(),
  ]);

  console.log(`Found: ${blogs.length} blog posts · ${services.length} services · ${portfolios.length} portfolios\n`);

  // ── Score each item ───────────────────────────────────────────────────────
  type Row = { type: string; id: string; title: string; score: number; band: string; slug: string };
  const rows: Row[] = [];

  const scoreItem = (type: string, item: any): Row => {
    // Mirror the form's useEffect: auto-populate canonical URL from slug when empty
    const canonicalUrl = (item.canonicalUrl || "").trim() || (item.slug ? `/${item.slug}` : "");
    const result = scoreSeo(
      {
        seoTitle:       item.seoTitle,
        seoDescription: item.seoDescription,
        focusKeyword:   item.focusKeyword,
        canonicalUrl,
        ogImage:        item.ogImage,
        content:        item.content,
        author:         item.author,
        updatedAt:      item.updatedAt,
      },
      weights,
      thresholds,
      brandName,
      nodeParseHtml
    );
    return {
      type,
      id: String(item._id),
      title: item.title || "(no title)",
      slug: item.slug || "",
      score: result.score,
      band: band(result.score),
    };
  };

  for (const b of blogs)     rows.push(scoreItem("Blog", b));
  for (const s of services)  rows.push(scoreItem("Service", s));
  for (const p of portfolios) rows.push(scoreItem("Portfolio", p));

  // ── Print report ──────────────────────────────────────────────────────────
  const header = `${"Type".padEnd(10)} ${"Score".padEnd(6)} ${"Band".padEnd(16)} Title`;
  const divider = "─".repeat(80);

  console.log("═".repeat(80));
  console.log("  SEO Score Backfill — Dry-Run Report");
  console.log("═".repeat(80));
  console.log(header);
  console.log(divider);

  const byType: Record<string, Row[]> = {};
  for (const row of rows) {
    byType[row.type] = byType[row.type] || [];
    byType[row.type].push(row);
  }

  for (const type of ["Blog", "Service", "Portfolio"]) {
    const group = byType[type] || [];
    if (group.length === 0) continue;
    for (const row of group) {
      console.log(`${row.type.padEnd(10)} ${String(row.score).padEnd(6)} ${pad(row.band, 16)} ${row.title}`);
    }
    const avg = Math.round(group.reduce((s, r) => s + r.score, 0) / group.length);
    console.log(divider);
    console.log(`${"".padEnd(10)} avg ${avg.toString().padEnd(3)}  (${group.length} ${type} items)`);
    console.log(divider);
  }

  const totalAvg = Math.round(rows.reduce((s, r) => s + r.score, 0) / (rows.length || 1));
  console.log(`\nTotal items: ${rows.length}  ·  Overall average score: ${totalAvg}`);
  console.log("═".repeat(80));

  // ── Write mode ────────────────────────────────────────────────────────────
  if (!writeMode) {
    console.log("\n[DRY RUN] No database writes performed.");
    console.log("Review the report above, then run with --write to persist scores.\n");
    await mongoose.disconnect();
    return;
  }

  console.log("\n[WRITE] Persisting scores to database…\n");

  let updated = 0;
  let errors = 0;

  for (const row of rows) {
    try {
      const Model =
        row.type === "Blog" ? PostModel :
        row.type === "Service" ? ServiceModel :
        PortfolioModel;

      await Model.findByIdAndUpdate(row.id, { $set: { seoScore: row.score } });
      console.log(`  ✓ ${row.type.padEnd(10)} score=${row.score}  ${row.title}`);
      updated++;
    } catch (err: any) {
      console.error(`  ✗ ${row.type} "${row.title}": ${err.message}`);
      errors++;
    }
  }

  console.log(`\n[WRITE] Done — ${updated} updated, ${errors} errors.\n`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
