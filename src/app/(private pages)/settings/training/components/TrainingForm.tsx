"use client";

import FormBuilder, { FieldConfig } from "@/dashboard/FormBuilder";
import SEOScorePanel, { SeoScoreBadge } from "@/dashboard/seo/SEOScorePanel";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PackageModule = { title: string; duration?: string; project?: string; description?: string };

export type PackageFormValues = {
  _id?: string;
  name: string;
  tier: "certificate" | "professional" | "job-ready";
  duration: string;
  totalFee: number | string;
  offlineTotalFee: number | string;
  registrationFee: number | string;
  installmentAmount: number | string;
  installmentCount: number | string;
  currency: string;
  scheduleType: "online" | "offline" | "both";
  nextCohortDate: string;
  classDays: string;
  enrolledCount: number | string;
  rating: number | string;
  isPopular: boolean;
  isJobReady: boolean;
  outcomeStatement: string;
  deliverables: string[];
  idealForThisPackage: string;
  modules: PackageModule[];
};

export type FaqItem = { question: string; answer: string };

export type TrainingFormValues = {
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  detailedDescription: string;
  prerequisites: string;
  certification: string;
  tools: string[];
  idealFor: string[];
  featured: boolean;
  published: boolean;
  // instructor (flattened)
  instructorName: string;
  instructorTitle: string;
  instructorPhoto: string;
  instructorBio: string;
  instructorExperience: string;
  // SEO
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogImage: string;
  ogImageAlt: string;
  seoScore?: number;
  // arrays (managed outside FormBuilder)
  faq: FaqItem[];
  packages: PackageFormValues[];
};

// ─── Empty values ─────────────────────────────────────────────────────────────

export const emptyPackage = (): PackageFormValues => ({
  name: "",
  tier: "certificate",
  duration: "",
  totalFee: "",
  offlineTotalFee: "",
  registrationFee: "",
  installmentAmount: "",
  installmentCount: "",
  currency: "BDT",
  scheduleType: "both",
  nextCohortDate: "",
  classDays: "",
  enrolledCount: 0,
  rating: 0,
  isPopular: false,
  isJobReady: false,
  outcomeStatement: "",
  deliverables: [],
  idealForThisPackage: "",
  modules: [{ title: "", duration: "", project: "", description: "" }],
});

export const emptyTrainingValues: TrainingFormValues = {
  title: "", slug: "", thumbnail: "",
  description: "", detailedDescription: "",
  prerequisites: "", certification: "",
  tools: [], idealFor: [],
  featured: false, published: false,
  instructorName: "", instructorTitle: "", instructorPhoto: "",
  instructorBio: "", instructorExperience: "",
  seoTitle: "", seoDescription: "", focusKeyword: "",
  canonicalUrl: "", ogImage: "", ogImageAlt: "",
  seoScore: undefined,
  faq: [],
  packages: [emptyPackage()],
};

// ─── FormBuilder field configs ────────────────────────────────────────────────

const courseFields: FieldConfig[] = [
  { name: "title", type: "text", required: true, label: "Course Title" },
  { name: "slug", type: "slug", source: "title", required: true, label: "URL Slug" },
  { name: "thumbnail", type: "image", label: "Thumbnail Image", optional: true, altField: "thumbnailAlt" },
  { name: "description", type: "textarea", required: true, label: "Short Description (card blurb)" },
  { name: "detailedDescription", type: "textarea", required: true, label: "Detailed Description" },
  { name: "prerequisites", type: "textarea", label: "Prerequisites", optional: true },
  { name: "certification", type: "text", label: "Certification", optional: true },
  { name: "tools", type: "tags", label: "Tools You'll Learn", optional: true, collection: "none" },
  { name: "idealFor", type: "tags", label: "Ideal For", optional: true, collection: "none" },
  { name: "featured", type: "toggle", label: "Featured", optional: true, default: false },
  { name: "published", type: "toggle", label: "Published", optional: true, default: false },
  // Instructor group
  { name: "instructorName", type: "text", label: "Name", group: "Instructor" },
  { name: "instructorTitle", type: "text", label: "Title / Role", group: "Instructor" },
  { name: "instructorPhoto", type: "image", label: "Photo", group: "Instructor" },
  { name: "instructorBio", type: "textarea", label: "Bio", group: "Instructor" },
  { name: "instructorExperience", type: "text", label: "Experience (e.g. 8+ years)", group: "Instructor" },
  // SEO group
  { name: "seoTitle", type: "text", label: "SEO Title", maxLength: 60, group: "SEO" },
  { name: "seoDescription", type: "textarea", label: "Meta Description", maxLength: 160, group: "SEO" },
  { name: "focusKeyword", type: "text", label: "Focus Keyword", group: "SEO" },
  { name: "canonicalUrl", type: "canonical-url", source: "slug", label: "Canonical URL", group: "SEO" },
  { name: "ogImage", type: "image", label: "OG Image (1200×630)", group: "SEO" },
];

// ─── Shared input class ────────────────────────────────────────────────────────

const inputCls =
  "min-h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

const selectCls =
  "min-h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

// ─── PackageCard ───────────────────────────────────────────────────────────────

function PackageCard({
  pkg,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  pkg: PackageFormValues;
  index: number;
  onUpdate: (index: number, next: PackageFormValues) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  const set = (field: keyof PackageFormValues, value: any) =>
    onUpdate(index, { ...pkg, [field]: value });

  const setModule = (mi: number, field: keyof PackageModule, value: string) => {
    const modules = pkg.modules.map((m, i) =>
      i === mi ? { ...m, [field]: value } : m
    );
    onUpdate(index, { ...pkg, modules });
  };

  const addModule = () =>
    onUpdate(index, { ...pkg, modules: [...pkg.modules, { title: "", duration: "", project: "", description: "" }] });

  const removeModule = (mi: number) =>
    onUpdate(index, { ...pkg, modules: pkg.modules.filter((_, i) => i !== mi) });

  const setDeliverable = (di: number, value: string) => {
    const deliverables = pkg.deliverables.map((d, i) => (i === di ? value : d));
    onUpdate(index, { ...pkg, deliverables });
  };

  const addDeliverable = () =>
    onUpdate(index, { ...pkg, deliverables: [...pkg.deliverables, ""] });

  const removeDeliverable = (di: number) =>
    onUpdate(index, { ...pkg, deliverables: pkg.deliverables.filter((_, i) => i !== di) });

  return (
    <Card>
      <CardHeader>
        <details open={index === 0}>
          <summary className="cursor-pointer text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Package {index + 1}{pkg.name ? ` — ${pkg.name}` : ""}
          </summary>

          <CardContent className="grid gap-5 px-0 pb-0 pt-5">
            {/* Identity */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
                <input className={inputCls} value={pkg.name} required onChange={(e) => set("name", e.target.value)} placeholder="6-Month Certificate" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Tier</label>
                <select className={selectCls} value={pkg.tier} onChange={(e) => set("tier", e.target.value)}>
                  <option value="certificate">Certificate</option>
                  <option value="professional">Professional</option>
                  <option value="job-ready">Job-Ready</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Duration <span className="text-red-500">*</span></label>
                <input className={inputCls} value={pkg.duration} required onChange={(e) => set("duration", e.target.value)} placeholder="6 months" />
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800 grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Installment Pricing</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Total Online Fee (৳) <span className="text-red-500">*</span></label>
                  <input type="number" className={inputCls} value={pkg.totalFee} required onChange={(e) => set("totalFee", e.target.value)} placeholder="9000" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Total Offline Fee (৳)</label>
                  <input type="number" className={inputCls} value={pkg.offlineTotalFee} onChange={(e) => set("offlineTotalFee", e.target.value)} placeholder="15000" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Registration Fee (৳) <span className="text-red-500">*</span></label>
                  <input type="number" className={inputCls} value={pkg.registrationFee} required onChange={(e) => set("registrationFee", e.target.value)} placeholder="3000" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Installment Amount (৳) <span className="text-red-500">*</span></label>
                  <input type="number" className={inputCls} value={pkg.installmentAmount} required onChange={(e) => set("installmentAmount", e.target.value)} placeholder="2000" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Number of Installments <span className="text-red-500">*</span></label>
                  <input type="number" className={inputCls} value={pkg.installmentCount} required onChange={(e) => set("installmentCount", e.target.value)} placeholder="3" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Currency</label>
                  <input className={inputCls} value={pkg.currency} onChange={(e) => set("currency", e.target.value)} placeholder="BDT" />
                </div>
              </div>
              {pkg.registrationFee && pkg.installmentAmount && pkg.installmentCount && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Preview: ৳{Number(pkg.registrationFee).toLocaleString()} registration + ৳{Number(pkg.installmentAmount).toLocaleString()} × {pkg.installmentCount} monthly installments = ৳{(Number(pkg.registrationFee) + Number(pkg.installmentAmount) * Number(pkg.installmentCount)).toLocaleString()} total
                </p>
              )}
            </div>

            {/* Schedule */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Schedule Type</label>
                <select className={selectCls} value={pkg.scheduleType} onChange={(e) => set("scheduleType", e.target.value)}>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Next Cohort Date</label>
                <input type="date" className={inputCls} value={pkg.nextCohortDate} onChange={(e) => set("nextCohortDate", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Class Days</label>
                <input className={inputCls} value={pkg.classDays} onChange={(e) => set("classDays", e.target.value)} placeholder="Sat–Thu, 6–9 PM" />
              </div>
            </div>

            {/* Stats + flags */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Enrolled Count</label>
                <input type="number" className={inputCls} value={pkg.enrolledCount} onChange={(e) => set("enrolledCount", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Rating (0–5)</label>
                <input type="number" step="0.1" min="0" max="5" className={inputCls} value={pkg.rating} onChange={(e) => set("rating", e.target.value)} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => set("isPopular", !pkg.isPopular)}
                  className={`h-6 w-11 rounded-full p-1 transition ${pkg.isPopular ? "bg-zinc-950 dark:bg-zinc-50" : "bg-zinc-300 dark:bg-zinc-800"}`}
                >
                  <span className={`block h-4 w-4 rounded-full bg-white transition dark:bg-zinc-950 ${pkg.isPopular ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm">Popular</span>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => set("isJobReady", !pkg.isJobReady)}
                  className={`h-6 w-11 rounded-full p-1 transition ${pkg.isJobReady ? "bg-zinc-950 dark:bg-zinc-50" : "bg-zinc-300 dark:bg-zinc-800"}`}
                >
                  <span className={`block h-4 w-4 rounded-full bg-white transition dark:bg-zinc-950 ${pkg.isJobReady ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm">Job-Ready</span>
              </div>
            </div>

            {/* Package Outcome */}
            <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800 grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Package Outcome</p>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Outcome Statement</label>
                <textarea
                  className={`${inputCls} min-h-16 py-2`}
                  value={pkg.outcomeStatement}
                  onChange={(e) => set("outcomeStatement", e.target.value)}
                  placeholder="After completing this package, you'll be able to…"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ideal For (this package)</label>
                <input
                  className={inputCls}
                  value={pkg.idealForThisPackage}
                  onChange={(e) => set("idealForThisPackage", e.target.value)}
                  placeholder="e.g. Beginners who want to start freelancing within 6 months"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Deliverables</label>
                  <Button type="button" variant="secondary" onClick={addDeliverable}>+ Add</Button>
                </div>
                {pkg.deliverables.map((d, di) => (
                  <div key={di} className="flex gap-2">
                    <input
                      className={inputCls}
                      value={d}
                      onChange={(e) => setDeliverable(di, e.target.value)}
                      placeholder={`Deliverable ${di + 1} (e.g. 3 portfolio websites)`}
                    />
                    <button
                      type="button"
                      onClick={() => removeDeliverable(di)}
                      className="shrink-0 rounded-md border border-zinc-200 px-3 text-sm text-zinc-500 hover:text-red-600 dark:border-zinc-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Modules</label>
                <Button type="button" variant="secondary" onClick={addModule}>+ Add Module</Button>
              </div>
              {pkg.modules.map((mod, mi) => (
                <div key={mi} className="grid gap-1.5 rounded-md border border-zinc-100 p-2 dark:border-zinc-800">
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      value={mod.title}
                      required
                      onChange={(e) => setModule(mi, "title", e.target.value)}
                      placeholder={`Module ${mi + 1} title`}
                    />
                    <input
                      className="min-h-10 w-28 shrink-0 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                      value={mod.duration ?? ""}
                      onChange={(e) => setModule(mi, "duration", e.target.value)}
                      placeholder="2 hrs"
                    />
                    {pkg.modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModule(mi)}
                        className="shrink-0 rounded-md border border-zinc-200 px-3 text-sm text-zinc-500 hover:text-red-600 dark:border-zinc-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <input
                    className="min-h-8 w-full rounded-md border border-zinc-100 bg-zinc-50 px-3 text-xs outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
                    value={mod.project ?? ""}
                    onChange={(e) => setModule(mi, "project", e.target.value)}
                    placeholder="🛠 Project (optional)"
                  />
                </div>
              ))}
            </div>

            {canRemove && (
              <div className="flex justify-end">
                <Button type="button" variant="secondary" onClick={() => onRemove(index)}>
                  Remove This Package
                </Button>
              </div>
            )}
          </CardContent>
        </details>
      </CardHeader>
    </Card>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function TrainingForm({
  pageTitle,
  pageDescription,
  initialValues = emptyTrainingValues,
  submitting,
  updatedAt,
  onSubmit,
}: {
  pageTitle: string;
  pageDescription: string;
  initialValues?: TrainingFormValues;
  submitting: boolean;
  updatedAt?: string | null;
  onSubmit: (values: TrainingFormValues) => Promise<void>;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<TrainingFormValues>({ ...emptyTrainingValues, ...initialValues });
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
    if (values.slug && !values.canonicalUrl) updateValue("canonicalUrl", `/training/${values.slug}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.slug]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); return (e.returnValue = ""); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => { initializingRef.current = false; }, []);

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
    const e: Record<string, string> = {};
    if (!values.title) e.title = "Title is required";
    if (!values.slug) e.slug = "Slug is required";
    if (!values.description) e.description = "Short description is required";
    if (!values.detailedDescription) e.detailedDescription = "Detailed description is required";
    if (values.packages.length === 0) e.packages = "At least one package is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Package helpers ─────────────────────────────────────────────────────────

  const updatePackage = useCallback((index: number, next: PackageFormValues) => {
    setValues((prev) => {
      const packages = prev.packages.map((p, i) => (i === index ? next : p));
      return { ...prev, packages };
    });
    if (!initializingRef.current) setIsDirty(true);
  }, []);

  const addPackage = () => {
    setValues((prev) => ({ ...prev, packages: [...prev.packages, emptyPackage()] }));
    setIsDirty(true);
  };

  const removePackage = (index: number) => {
    setValues((prev) => ({ ...prev, packages: prev.packages.filter((_, i) => i !== index) }));
    setIsDirty(true);
  };

  // ─── FAQ helpers ──────────────────────────────────────────────────────────────

  const updateFaq = (index: number, field: keyof FaqItem, val: string) => {
    setValues((prev) => {
      const faq = prev.faq.map((item, i) => (i === index ? { ...item, [field]: val } : item));
      return { ...prev, faq };
    });
    if (!initializingRef.current) setIsDirty(true);
  };

  const addFaq = () => {
    setValues((prev) => ({ ...prev, faq: [...prev.faq, { question: "", answer: "" }] }));
    setIsDirty(true);
  };

  const removeFaq = (index: number) => {
    setValues((prev) => ({ ...prev, faq: prev.faq.filter((_, i) => i !== index) }));
    setIsDirty(true);
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(values);
    setIsDirty(false);
    router.push("/settings/training");
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

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      {/* Sticky header */}
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
            {submitting ? "Saving…" : "Save Course"}
          </button>
          <a
            href="/settings/training"
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Back
          </a>
        </div>
      </div>

      {/* Main card: course-level fields + SEO panel */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">Course Details</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Core information, instructor, and SEO metadata.</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="grid gap-5">
              <FormBuilder
                fields={courseFields}
                values={values as unknown as Record<string, any>}
                onChange={handleFieldChange}
                errors={errors}
              />
              {errors.packages && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.packages}</p>
              )}
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

      {/* Packages section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">Packages</h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Each package is a distinct enrolment tier with its own pricing, schedule, and modules.
            </p>
          </div>
          <Button type="button" onClick={addPackage}>+ Add Package</Button>
        </div>

        {values.packages.map((pkg, i) => (
          <PackageCard
            key={pkg._id || i}
            pkg={pkg}
            index={i}
            onUpdate={updatePackage}
            onRemove={removePackage}
            canRemove={values.packages.length > 1}
          />
        ))}
      </div>

      {/* FAQ section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">FAQ</h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                Frequently asked questions shown on the course detail page.
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={addFaq}>+ Add FAQ</Button>
          </div>
        </CardHeader>
        {values.faq.length > 0 && (
          <CardContent className="grid gap-4">
            {values.faq.map((item, i) => (
              <div key={i} className="grid gap-2 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">FAQ {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(i)}
                    className="text-xs text-zinc-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className={inputCls}
                  value={item.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                  placeholder="Question"
                  required
                />
                <textarea
                  className={`${inputCls} min-h-20 py-2`}
                  value={item.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                  placeholder="Answer"
                  required
                />
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Unsaved-changes dialog */}
      {pendingHref && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Unsaved Changes</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              You have unsaved changes. What would you like to do?
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button onClick={handleSaveAndLeave} disabled={submitting}>
                {submitting ? "Saving…" : "Save & Leave"}
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
