"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import SEOScorePanel, { SeoScoreBadge } from "@/dashboard/seo/SEOScorePanel";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<PortfolioFormValues>({
    ...emptyPortfolioValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const updateValue = useCallback((name: string, value: any) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const handleFieldChange = useCallback((name: string, value: any) => {
    setIsDirty(true);
    updateValue(name, value);
  }, [updateValue]);

  // Auto-populate canonical URL from slug when it's empty
  useEffect(() => {
    if (values.slug && !values.canonicalUrl) {
      updateValue("canonicalUrl", `/${values.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.slug]);

  // Warn on browser close/reload when dirty
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = "");
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Intercept sidebar link clicks when dirty
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as Element)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      if (href === window.location.pathname) return;
      if (containerRef.current?.contains(anchor)) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(href);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [isDirty]);

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

  const handleSaveAndLeave = async () => {
    if (!pendingHref) return;
    if (!validate()) { setPendingHref(null); return; }
    try {
      await onSubmit(values);
      router.push(pendingHref);
    } catch {
      setPendingHref(null);
    }
  };

  const handleLeaveWithoutSaving = () => {
    if (!pendingHref) return;
    const href = pendingHref;
    setIsDirty(false);
    setPendingHref(null);
    router.push(href);
  };

  return (
    <div ref={containerRef}>
      <button
        type="submit"
        form="portfolio-edit-form"
        disabled={submitting}
        className="fixed right-4 top-[72px] z-[60] inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {submitting ? "Saving…" : "Save Portfolio"}
      </button>
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
            <div className="flex shrink-0 items-center gap-3">
              {values.seoScore != null && (
                <SeoScoreBadge score={values.seoScore} />
              )}
              <button
                type="submit"
                form="portfolio-edit-form"
                disabled={submitting}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {submitting ? "Saving…" : "Save Portfolio"}
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Left: all form fields */}
            <form
              id="portfolio-edit-form"
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
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Save Portfolio"}
                </Button>
              </div>
            </form>

            {/* Right: sticky SEO score panel */}
            <div className="lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
              <SEOScorePanel
                mode="full"
                values={values}
                updatedAt={updatedAt}
                onScoreComputed={isDirty ? (score) => updateValue("seoScore", score) : undefined}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unsaved-changes confirmation dialog */}
      {pendingHref && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Unsaved Changes
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              You have unsaved changes. What would you like to do?
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button onClick={handleSaveAndLeave} disabled={submitting}>
                {submitting ? "Saving…" : "Save & Leave"}
              </Button>
              <Button variant="secondary" onClick={handleLeaveWithoutSaving}>
                Leave Without Saving
              </Button>
              <Button variant="secondary" onClick={() => setPendingHref(null)}>
                Stay on Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
