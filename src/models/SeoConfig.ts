import mongoose, { models, Schema } from "mongoose";

const SeoConfigSchema = new Schema(
  {
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
    lastReviewed: { type: Date },
  },
  { timestamps: true }
);

const SeoConfig =
  models.SeoConfig || mongoose.model("SeoConfig", SeoConfigSchema);

export default SeoConfig;

export type SeoConfigWeights = {
  basicSeo: number;
  contentQuality: number;
  linksStructure: number;
  aeo: number;
  geo: number;
};

export type SeoConfigThresholds = {
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

export type SeoConfigData = {
  weights: SeoConfigWeights;
  thresholds: SeoConfigThresholds;
  lastReviewed?: string | null;
};

export const defaultSeoConfig: SeoConfigData = {
  weights: {
    basicSeo: 35,
    contentQuality: 20,
    linksStructure: 10,
    aeo: 20,
    geo: 15,
  },
  thresholds: {
    minWordCount: 300,
    goodWordCount: 600,
    minSeoTitleLength: 30,
    maxSeoTitleLength: 60,
    minMetaDescLength: 120,
    maxMetaDescLength: 160,
    firstParaMinWords: 20,
    tldrMaxWords: 50,
    freshnessMonths: 6,
  },
  lastReviewed: null,
};
