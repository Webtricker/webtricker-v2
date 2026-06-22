"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import SEOScorePanel, { SeoScoreBadge } from "@/dashboard/seo/SEOScorePanel";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type CareerFormValues = {
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  workMode: string;
  vacancyCount: number | string;
  salaryRange: string;
  shortDescription: string;
  fullDescription: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  applicationDeadline: string;
  howToApply: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogImage: string;
  ogImageAlt: string;
  featured: boolean;
  published: boolean;
  seoScore?: number;
};

export const emptyCareerValues: CareerFormValues = {
  title: "",
  slug: "",
  department: "",
  location: "",
  employmentType: "full-time",
  experienceLevel: "mid",
  workMode: "onsite",
  vacancyCount: 1,
  salaryRange: "",
  shortDescription: "",
  fullDescription: "",
  responsibilities: [],
  requirements: [],
  niceToHave: [],
  benefits: [],
  applicationDeadline: "",
  howToApply: "",
  seoTitle: "",
  seoDescription: "",
  focusKeyword: "",
  canonicalUrl: "",
  ogImage: "",
  ogImageAlt: "",
  featured: false,
  published: false,
  seoScore: undefined,
};

const careerFields: FieldConfig[] = [
  { name: "title", type: "text", required: true, label: "Job Title" },
  { name: "slug", type: "slug", source: "title", required: true, label: "URL Slug" },
  { name: "department", type: "text", required: true, label: "Department" },
  { name: "location", type: "text", required: true, label: "Location" },
  {
    name: "employmentType",
    type: "select",
    required: true,
    label: "Employment Type",
    options: [
      { label: "Full-time", value: "full-time" },
      { label: "Part-time", value: "part-time" },
      { label: "Contract", value: "contract" },
      { label: "Internship", value: "internship" },
      { label: "Freelance", value: "freelance" },
    ],
  },
  {
    name: "experienceLevel",
    type: "select",
    required: true,
    label: "Experience Level",
    options: [
      { label: "Entry", value: "entry" },
      { label: "Junior", value: "junior" },
      { label: "Mid", value: "mid" },
      { label: "Senior", value: "senior" },
      { label: "Lead", value: "lead" },
    ],
  },
  {
    name: "workMode",
    type: "select",
    required: true,
    label: "Work Mode",
    options: [
      { label: "Onsite", value: "onsite" },
      { label: "Remote", value: "remote" },
      { label: "Hybrid", value: "hybrid" },
    ],
  },
  { name: "vacancyCount", type: "number", required: true, label: "Vacancy Count" },
  { name: "salaryRange", type: "text", label: "Salary Range", optional: true },
  { name: "shortDescription", type: "textarea", required: true, label: "Short Description" },
  { name: "fullDescription", type: "richtext", required: true, label: "Full Description" },
  { name: "responsibilities", type: "tags", label: "Responsibilities", collection: "none" },
  { name: "requirements", type: "tags", label: "Requirements", collection: "none" },
  { name: "niceToHave", type: "tags", label: "Nice To Have", collection: "none", optional: true },
  { name: "benefits", type: "tags", label: "Benefits", collection: "none", optional: true },
  { name: "applicationDeadline", type: "date", label: "Application Deadline", optional: true },
  { name: "howToApply", type: "textarea", label: "How To Apply (email or external link)", optional: true },
  { name: "featured", type: "toggle", label: "Featured", optional: true, default: false },
  { name: "published", type: "toggle", label: "Published", optional: true, default: false },
  { name: "seoTitle", type: "text", label: "SEO Title", maxLength: 60, group: "SEO" },
  { name: "seoDescription", type: "textarea", label: "Meta Description", maxLength: 160, group: "SEO" },
  { name: "focusKeyword", type: "text", label: "Focus Keyword", group: "SEO" },
  { name: "canonicalUrl", type: "canonical-url", source: "slug", label: "Canonical URL", group: "SEO" },
  { name: "ogImage", type: "image", label: "OG Image (1200x630)", group: "SEO", altField: "ogImageAlt" },
];

export default function CareerForm({
  pageTitle,
  pageDescription,
  initialValues = emptyCareerValues,
  submitting,
  updatedAt,
  onSubmit,
}: {
  pageTitle: string;
  pageDescription: string;
  initialValues?: CareerFormValues;
  submitting: boolean;
  updatedAt?: string | null;
  onSubmit: (values: CareerFormValues) => Promise<void>;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<CareerFormValues>({ ...emptyCareerValues, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const initializingRef = useRef(true);

  const updateValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFieldChange = useCallback((name: string, value: any) => {
    if (!initializingRef.current) setIsDirty(true);
    updateValue(name, value);
  }, [updateValue]);

  useEffect(() => {
    if (values.slug && !values.canonicalUrl) updateValue("canonicalUrl", `/career/${values.slug}`);
  }, [updateValue, values.canonicalUrl, values.slug]);

  useEffect(() => { initializingRef.current = false; }, []);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); return (e.returnValue = ""); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

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
    if (!values.department) nextErrors.department = "Department is required";
    if (!values.location) nextErrors.location = "Location is required";
    if (!values.shortDescription) nextErrors.shortDescription = "Short description is required";
    if (!values.fullDescription) nextErrors.fullDescription = "Full description is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(values);
    setIsDirty(false);
    router.push("/settings/career");
  };

  const handleSaveAndLeave = async () => {
    if (!pendingHref) return;
    if (!validate()) { setPendingHref(null); return; }
    const destination = pendingHref;
    setPendingHref(null);
    try {
      await onSubmit(values);
      setIsDirty(false);
      router.push(destination);
    } catch {
      setPendingHref(destination);
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
    <div ref={containerRef} className="flex flex-col gap-6">
      <div className="sticky top-16 z-[25] -mx-4 flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">{pageTitle}</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{pageDescription}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {values.seoScore != null && <SeoScoreBadge score={values.seoScore} />}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {submitting ? "Saving..." : "Save Listing"}
          </button>
          <a
            href="/settings/career"
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Back
          </a>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">Career Details</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Job information, application instructions, list sections, and SEO metadata.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="grid gap-5">
              <FormBuilder
                fields={careerFields}
                values={values as unknown as Record<string, any>}
                onChange={handleFieldChange}
                errors={errors}
              />
            </div>
            <div className="lg:sticky lg:top-40 lg:self-start lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
              <SEOScorePanel
                mode="full"
                values={values as unknown as Record<string, any>}
                updatedAt={updatedAt}
                onScoreComputed={isDirty ? (score) => updateValue("seoScore", score) : undefined}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {pendingHref && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Unsaved Changes</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              You have unsaved changes. What would you like to do?
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button onClick={handleSaveAndLeave} disabled={submitting}>
                {submitting ? "Saving..." : "Save & Leave"}
              </Button>
              <Button variant="secondary" onClick={handleLeaveWithoutSaving}>Leave Without Saving</Button>
              <Button variant="secondary" onClick={() => setPendingHref(null)}>Stay on Page</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
