"use client";

import { useState } from "react";
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

export default function AddCareerPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: CareerFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/career", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(values)),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create listing");
      toast.success("Career listing created");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create career listing");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CareerForm
      pageTitle="New Career Listing"
      pageDescription="Create a job post with application details and SEO metadata."
      initialValues={emptyCareerValues}
      submitting={submitting}
      onSubmit={handleSubmit}
    />
  );
}
