"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import SEOScorePanel, { SeoScoreBadge } from "@/dashboard/seo/SEOScorePanel";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type ServiceFormValues = {
  title: string;
  slug: string;
  icon: string;
  thumnail: string;
  thumbnailAlt?: string;
  thumbnailTitle?: string;
  category: string;
  tags: string[];
  excerpt?: string;
  subServices: string[];
  content: string;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  seoScore?: number;
};

const serviceFields: FieldConfig[] = [
  { name: "title", type: "text", required: true, label: "Service Title" },
  { name: "slug", type: "slug", source: "title", required: true, label: "URL Slug" },
  { name: "icon", type: "image", required: true, label: "Service Icon" },
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
  { name: "category", type: "text", required: true, label: "Category" },
  { name: "tags", type: "tags", label: "Tags", optional: true },
  { name: "excerpt", type: "textarea", label: "Excerpt", optional: true },
  {
    name: "subServices",
    type: "tags",
    collection: "none",
    label: "Sub-Services",
    optional: true,
  },
  { name: "content", type: "richtext", required: true, label: "Content" },
  { name: "author", type: "text", label: "Author", optional: true },
  { name: "seoTitle", type: "text", label: "SEO Title", maxLength: 60, group: "SEO" },
  {
    name: "seoDescription",
    type: "textarea",
    label: "Meta Description",
    maxLength: 160,
    group: "SEO",
  },
  { name: "focusKeyword", type: "text", label: "Focus Keyword", group: "SEO", optional: true },
  { name: "canonicalUrl", type: "canonical-url", source: "slug", label: "Canonical URL", group: "SEO", optional: true },
  { name: "ogImage", type: "image", label: "OG Image (1200x630)", group: "SEO", optional: true },
];

export const emptyServiceValues: ServiceFormValues = {
  title: "",
  slug: "",
  icon: "",
  thumnail: "",
  thumbnailAlt: "",
  thumbnailTitle: "",
  category: "",
  tags: [],
  excerpt: "",
  subServices: [],
  content: "",
  author: "",
  seoTitle: "",
  seoDescription: "",
  focusKeyword: "",
  canonicalUrl: "",
  ogImage: "",
  ogImageAlt: "",
  seoScore: undefined,
};

export default function ServiceForm({
  title,
  description,
  initialValues = emptyServiceValues,
  submitting,
  updatedAt,
  onSubmit,
}: {
  title: string;
  description: string;
  initialValues?: ServiceFormValues;
  submitting: boolean;
  updatedAt?: string | null;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<ServiceFormValues>({
    ...emptyServiceValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const initializingRef = useRef(true);

  const updateValue = useCallback((name: string, value: any) => {
    setValues((current) => ({ ...current, [name]: value }));
  }, []);

  const handleFieldChange = useCallback((name: string, value: any) => {
    if (!initializingRef.current) setIsDirty(true);
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

  // Mark form as ready for dirty tracking after all mount effects complete
  useEffect(() => { initializingRef.current = false; }, []);

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
    if (!values.icon) nextErrors.icon = "Service icon is required";
    if (!values.thumnail) nextErrors.thumnail = "Featured image is required";
    if (!values.category) nextErrors.category = "Category is required";
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
                form="service-edit-form"
                disabled={submitting}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {submitting ? "Saving…" : "Save Service"}
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Left: all form fields */}
            <form
              id="service-edit-form"
              className="grid gap-5"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!validate()) return;
                await onSubmit(values);
              }}
            >
              <FormBuilder
                fields={serviceFields}
                values={values}
                onChange={handleFieldChange}
                errors={errors}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Save Service"}
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
