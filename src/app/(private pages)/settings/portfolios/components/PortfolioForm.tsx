"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import SEOScorePanel, { SeoScoreBadge } from "@/dashboard/seo/SEOScorePanel";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useEffect, useState } from "react";

export type PortfolioFormValues = {
  title: string;
  slug: string;
  thumnail: string;
  thumbnailAlt?: string;
  thumbnailTitle?: string;
  coverImage: string;
  coverImageAlt?: string;
  technology: string;
  tags: string[];
  description: string;
  excerp?: string;
  liveLink: string;
  content: string;
  author?: string;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  seoScore?: number;
};

const portfolioFields: FieldConfig[] = [
  { name: "title", type: "text", required: true, label: "Project Title" },
  { name: "slug", type: "slug", source: "title", required: true, label: "URL Slug" },
  {
    name: "thumnail",
    type: "image",
    required: true,
    label: "Thumbnail",
    altField: "thumbnailAlt",
    titleField: "thumbnailTitle",
  },
  { name: "thumbnailAlt", type: "text", label: "Thumbnail Alt Text", optional: true },
  { name: "thumbnailTitle", type: "text", label: "Thumbnail Title", optional: true },
  {
    name: "coverImage",
    type: "image",
    required: true,
    label: "Cover Image",
    altField: "coverImageAlt",
  },
  { name: "coverImageAlt", type: "text", label: "Cover Image Alt Text", optional: true },
  {
    name: "technology",
    type: "relation",
    collection: "portfolio-technologies",
    required: true,
    label: "Technology",
  },
  { name: "tags", type: "tags", label: "Tags", optional: true },
  { name: "description", type: "textarea", required: true, label: "Short Description" },
  { name: "excerp", type: "textarea", label: "Excerpt", optional: true },
  { name: "liveLink", type: "url", required: true, label: "Live Project URL" },
  { name: "content", type: "richtext", required: true, label: "Content" },
  { name: "author", type: "text", label: "Author", optional: true },
  { name: "featured", type: "toggle", label: "Featured Project", optional: true, default: false },
  { name: "seoTitle", type: "text", label: "SEO Title", maxLength: 60, group: "SEO" },
  { name: "seoDescription", type: "textarea", label: "Meta Description", maxLength: 160, group: "SEO" },
  { name: "focusKeyword", type: "text", label: "Focus Keyword", group: "SEO", optional: true },
  { name: "canonicalUrl", type: "canonical-url", source: "slug", label: "Canonical URL", group: "SEO", optional: true },
  { name: "ogImage", type: "image", label: "OG Image (1200x630)", group: "SEO", optional: true },
];

export const emptyPortfolioValues: PortfolioFormValues = {
  title: "",
  slug: "",
  thumnail: "",
  thumbnailAlt: "",
  thumbnailTitle: "",
  coverImage: "",
  coverImageAlt: "",
  technology: "",
  tags: [],
  description: "",
  excerp: "",
  liveLink: "",
  content: "",
  author: "",
  featured: false,
  seoTitle: "",
  seoDescription: "",
  focusKeyword: "",
  canonicalUrl: "",
  ogImage: "",
  ogImageAlt: "",
  seoScore: undefined,
};

export default function PortfolioForm({
  title,
  description,
  initialValues = emptyPortfolioValues,
  submitting,
  updatedAt,
  onSubmit,
}: {
  title: string;
  description: string;
  initialValues?: PortfolioFormValues;
  submitting: boolean;
  updatedAt?: string | null;
  onSubmit: (values: PortfolioFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<PortfolioFormValues>({
    ...emptyPortfolioValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateValue = (name: string, value: any) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleFieldChange = (name: string, value: any) => {
    setIsDirty(true);
    updateValue(name, value);
  };

  // Auto-populate canonical URL from slug when it's empty
  useEffect(() => {
    if (values.slug && !values.canonicalUrl) {
      updateValue("canonicalUrl", `/${values.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.slug]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.title) nextErrors.title = "Title is required";
    if (!values.slug) nextErrors.slug = "Slug is required";
    if (!values.thumnail) nextErrors.thumnail = "Thumbnail is required";
    if (!values.coverImage) nextErrors.coverImage = "Cover image is required";
    if (!values.technology) nextErrors.technology = "Technology is required";
    if (!values.description) nextErrors.description = "Description is required";
    if (!values.liveLink) nextErrors.liveLink = "Live link is required";
    if (!values.content) nextErrors.content = "Content is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
              {title}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </div>
          {values.seoScore != null && (
            <SeoScoreBadge score={values.seoScore} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!validate()) return;
            await onSubmit(values);
          }}
        >
          <FormBuilder
            fields={portfolioFields}
            values={values}
            onChange={handleFieldChange}
            errors={errors}
          />
          <SEOScorePanel
            mode="full"
            values={values}
            updatedAt={updatedAt}
            onScoreComputed={isDirty ? (score) => updateValue("seoScore", score) : undefined}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Portfolio"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
