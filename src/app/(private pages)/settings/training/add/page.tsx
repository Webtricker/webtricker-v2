"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import TrainingForm, {
  TrainingFormValues,
  emptyTrainingValues,
} from "../components/TrainingForm";

const toPayload = (v: TrainingFormValues) => ({
  slug: v.slug,
  title: v.title,
  thumbnail: v.thumbnail || undefined,
  description: v.description,
  detailedDescription: v.detailedDescription,
  tools: v.tools,
  idealFor: v.idealFor,
  prerequisites: v.prerequisites || undefined,
  certification: v.certification || undefined,
  instructor: {
    name: v.instructorName || undefined,
    title: v.instructorTitle || undefined,
    photo: v.instructorPhoto || undefined,
    bio: v.instructorBio || undefined,
    experience: v.instructorExperience || undefined,
  },
  faq: v.faq,
  packages: v.packages.map((p) => ({
    ...(p._id ? { _id: p._id } : {}),
    name: p.name,
    tier: p.tier,
    duration: p.duration,
    totalFee: Number(p.totalFee),
    offlineTotalFee: p.offlineTotalFee !== "" ? Number(p.offlineTotalFee) : undefined,
    registrationFee: Number(p.registrationFee),
    installmentAmount: Number(p.installmentAmount),
    installmentCount: Number(p.installmentCount),
    currency: p.currency || "BDT",
    modules: p.modules.filter((m) => m.title.trim()),
    scheduleType: p.scheduleType,
    nextCohortDate: p.nextCohortDate || undefined,
    classDays: p.classDays || undefined,
    enrolledCount: Number(p.enrolledCount) || 0,
    rating: Number(p.rating) || 0,
    isPopular: Boolean(p.isPopular),
    isJobReady: Boolean(p.isJobReady),
  })),
  seoTitle: v.seoTitle || undefined,
  seoDescription: v.seoDescription || undefined,
  focusKeyword: v.focusKeyword || undefined,
  canonicalUrl: v.canonicalUrl || undefined,
  ogImage: v.ogImage || undefined,
  ogImageAlt: v.ogImageAlt || undefined,
  featured: Boolean(v.featured),
  published: Boolean(v.published),
});

export default function AddTrainingPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: TrainingFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/training", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(values)),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create course");
      toast.success("Training course created");
    } catch (e: any) {
      toast.error(e?.message || "Failed to create course");
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <TrainingForm
      pageTitle="New Training Course"
      pageDescription="Create a course with packages, installment pricing, and SEO metadata."
      initialValues={emptyTrainingValues}
      submitting={submitting}
      onSubmit={handleSubmit}
    />
  );
}
