"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import SEOScorePanel, { SeoScoreBadge } from "@/dashboard/seo/SEOScorePanel";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useEffect, useState } from "react";

export type BlogFormValues = {
  title: string;
  slug: string;
  thumnail: string;
  thumbnailAlt?: string;
  thumbnailTitle?: string;
  category: string;
  tags: string[];
  content: string;
  excerp?: string;
  author?: string;
  readingTime?: number;
  featured: boolean;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  seoScore?: number;
};

const blogFields: FieldConfig[] = [
  { name: "title", type: "text", required: true, label: "Post Title" },
  { name: "slug", type: "slug", source: "title", required: true, label: "URL Slug" },
  {
    name: "thumnail",
    type: "image",
    required: true,
    label: "Featured Image",
    altField: "thumbnailAlt",
    titleField: "thumbnailTitle",
  },
  { name: "thumbnailAlt", type: "text", label: "Image Alt Text", optional: true },
  { name: "thumbnailTitle", type: "text", label: "Image Title", optional: true },
  { name: "category", type: "relation", collection: "categories", required: true, label: "Category" },
  { name: "tags", type: "tags", label: "Tags", optional: true },
  { name: "content", type: "richtext", required: true, label: "Content" },
  { name: "excerp", type: "textarea", label: "Excerpt", optional: true },
  { name: "author", type: "text", label: "Author", optional: true },
  { name: "readingTime", type: "number", label: "Reading Time (minutes)", optional: true },
  { name: "published", type: "toggle", label: "Published", default: false },
  { name: "featured", type: "toggle", label: "Featured Post", optional: true, default: false },
  { name: "seoTitle", type: "text", label: "SEO Title", maxLength: 60, group: "SEO" },
  { name: "seoDescription", type: "textarea", label: "Meta Description", maxLength: 160, group: "SEO" },
  { name: "focusKeyword", type: "text", label: "Focus Keyword", group: "SEO", optional: true },
  { name: "canonicalUrl", type: "canonical-url", source: "slug", label: "Canonical URL", group: "SEO", optional: true },
  { name: "ogImage", type: "image", label: "OG Image (1200x630)", group: "SEO", optional: true },
];

export const emptyBlogValues: BlogFormValues = {
  title: "",
  slug: "",
  thumnail: "",
  thumbnailAlt: "",
  thumbnailTitle: "",
  category: "",
  tags: [],
  content: "",
  excerp: "",
  author: "",
  readingTime: undefined,
  featured: false,
  published: false,
  seoTitle: "",
  seoDescription: "",
  focusKeyword: "",
  canonicalUrl: "",
  ogImage: "",
  ogImageAlt: "",
  seoScore: undefined,
};

export default function BlogForm({
  title,
  description,
  initialValues = emptyBlogValues,
  submitting,
  updatedAt,
  onSubmit,
}: {
  title: string;
  description: string;
  initialValues?: BlogFormValues;
  submitting: boolean;
  updatedAt?: string | null;
  onSubmit: (values: BlogFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<BlogFormValues>({
    ...emptyBlogValues,
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
    // Only re-run when slug changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.slug]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!values.title) nextErrors.title = "Title is required";
    if (!values.slug) nextErrors.slug = "Slug is required";
    if (!values.thumnail) nextErrors.thumnail = "Featured image is required";
    if (!values.category) nextErrors.category = "Category is required";
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
            fields={blogFields}
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
              {submitting ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
