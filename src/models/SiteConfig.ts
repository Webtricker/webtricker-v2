import mongoose, { models, Schema } from "mongoose";

const OpeningHoursSchema = new Schema(
  {
    days: { type: [String], required: true },
    opens: { type: String, required: true },
    closes: { type: String, required: true },
    timezone: { type: String, required: true },
  },
  { _id: false }
);

const OfficeSchema = new Schema(
  {
    label: { type: String, required: true },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    locality: { type: String, required: true },
    region: { type: String, required: true },
    postalCode: { type: String, required: true },
    addressText: { type: String, required: true },
    openingHours: { type: [OpeningHoursSchema], default: [] },
  },
  { _id: false }
);

const SocialLinkSchema = new Schema(
  {
    platform: { type: String, required: true },
    href: { type: String, required: true },
    isExternal: { type: Boolean, required: true, default: true },
  },
  { _id: false }
);

const SiteConfigSchema = new Schema(
  {
    brand: {
      name: { type: String, required: true, default: "Webtricker" },
      legalName: { type: String, required: true, default: "Webtricker LLC" },
      url: { type: String, required: true, default: "https://webtricker.com" },
      description: { type: String, required: true },
      logo: { type: String, required: true },
      sameAs: { type: [String], default: [] },
    },
    contact: {
      primaryEmail: { type: String, required: true },
      emails: { type: [String], default: [] },
      primaryPhone: { type: String, required: true },
      phones: { type: [String], default: [] },
    },
    offices: { type: [OfficeSchema], default: [] },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    schemaConfig: {
      businessType: {
        type: String,
        required: true,
        enum: ["ProfessionalService"],
        default: "ProfessionalService",
      },
      organizationJsonLdEnabled: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
  },
  { timestamps: true }
);

const SiteConfig =
  models.SiteConfig || mongoose.model("SiteConfig", SiteConfigSchema);

export default SiteConfig;
