"use client";

import { Card, CardContent } from "@/dashboard/ui";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CareerForm, {
  CareerFormValues,
  emptyCareerValues,
} from "../components/CareerForm";

const cleanList = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);

const toPayload = (values: CareerFormValues) => ({
  title: values.title,
  slug: values.slug,
  department: values.department,
  location: values.location,
  employmentType: values.employmentType,
  experienceLevel: values.experienceLevel,
  workMode: values.workMode,
  vacancyCount: Number(values.vacancyCount) || 0,
  salaryRange: values.salaryRange || undefined,
  shortDescription: values.shortDescription,
  fullDescription: values.fullDescription,
  responsibilities: cleanList(values.responsibilities),
  requirements: cleanList(values.requirements),
  niceToHave: cleanList(values.niceToHave),
  benefits: cleanList(values.benefits),
  applicationDeadline: values.applicationDeadline || undefined,
  howToApply: values.howToApply || undefined,
  seoTitle: values.seoTitle || undefined,
  seoDescription: values.seoDescription || undefined,
  focusKeyword: values.focusKeyword || undefined,
  canonicalUrl: values.canonicalUrl || undefined,
  ogImage: values.ogImage || undefined,
  ogImageAlt: values.ogImageAlt || undefined,
  featured: Boolean(values.featured),
  published: Boolean(values.published),
});

const normalizeValues = (career: any): CareerFormValues => ({
  ...emptyCareerValues,
  title: career.title || "",
  slug: career.slug || "",
  department: career.department || "",
  location: career.location || "",
  employmentType: career.employmentType || "full-time",
  experienceLevel: career.experienceLevel || "mid",
  workMode: career.workMode || "onsite",
  vacancyCount: career.vacancyCount ?? 1,
  salaryRange: career.salaryRange || "",
  shortDescription: career.shortDescription || "",
  fullDescription: career.fullDescription || "",
  responsibilities: Array.isArray(career.responsibilities) ? career.responsibilities : [],
  requirements: Array.isArray(career.requirements) ? career.requirements : [],
  niceToHave: Array.isArray(career.niceToHave) ? career.niceToHave : [],
  benefits: Array.isArray(career.benefits) ? career.benefits : [],
  applicationDeadline: career.applicationDeadline
    ? new Date(career.applicationDeadline).toISOString().split("T")[0]
    : "",
  howToApply: career.howToApply || "",
  seoTitle: career.seoTitle || "",
  seoDescription: career.seoDescription || "",
  focusKeyword: career.focusKeyword || "",
  canonicalUrl: career.canonicalUrl || "",
  ogImage: career.ogImage || "",
  ogImageAlt: career.ogImageAlt || "",
  featured: Boolean(career.featured),
  published: Boolean(career.published),
  seoScore: career.seoScore ?? undefined,
});

export default function EditCareerPage() {
  const params = useParams<{ slug: string }>();
  const [values, setValues] = useState<CareerFormValues | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/career/${params.slug}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok || !data.career) throw new Error(data.message || "Failed to load");
        if (mounted) {
          setValues(normalizeValues(data.career));
          setUpdatedAt(data.career.updatedAt || null);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to load career listing");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [params.slug]);

  const handleSubmit = async (nextValues: CareerFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/career/${params.slug}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(nextValues)),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update listing");
      toast.success("Career listing updated");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update career listing");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-4">
          <div className="h-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </CardContent>
      </Card>
    );
  }

  if (!values) {
    return (
      <Card>
        <CardContent className="pt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Career listing not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <CareerForm
      pageTitle="Edit Career Listing"
      pageDescription="Update job content, application details, and SEO metadata."
      initialValues={values}
      submitting={submitting}
      updatedAt={updatedAt}
      onSubmit={handleSubmit}
    />
  );
}
