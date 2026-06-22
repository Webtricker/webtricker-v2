"use client";

import { Card, CardContent } from "@/dashboard/ui";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

const normalizeValues = (course: any): TrainingFormValues => ({
  ...emptyTrainingValues,
  title: course.title || "",
  slug: course.slug || "",
  thumbnail: course.thumbnail || "",
  description: course.description || "",
  detailedDescription: course.detailedDescription || "",
  tools: Array.isArray(course.tools) ? course.tools : [],
  idealFor: Array.isArray(course.idealFor) ? course.idealFor : [],
  prerequisites: course.prerequisites || "",
  certification: course.certification || "",
  featured: Boolean(course.featured),
  published: Boolean(course.published),
  instructorName: course.instructor?.name || "",
  instructorTitle: course.instructor?.title || "",
  instructorPhoto: course.instructor?.photo || "",
  instructorBio: course.instructor?.bio || "",
  instructorExperience: course.instructor?.experience || "",
  faq: Array.isArray(course.faq) ? course.faq : [],
  packages: Array.isArray(course.packages) && course.packages.length > 0
    ? course.packages.map((p: any) => ({
        _id: p._id ? String(p._id) : undefined,
        name: p.name || "",
        tier: p.tier || "certificate",
        duration: p.duration || "",
        totalFee: p.totalFee ?? "",
        offlineTotalFee: p.offlineTotalFee ?? "",
        registrationFee: p.registrationFee ?? "",
        installmentAmount: p.installmentAmount ?? "",
        installmentCount: p.installmentCount ?? "",
        currency: p.currency || "BDT",
        scheduleType: p.scheduleType || "both",
        nextCohortDate: p.nextCohortDate
          ? new Date(p.nextCohortDate).toISOString().split("T")[0]
          : "",
        classDays: p.classDays || "",
        enrolledCount: p.enrolledCount ?? 0,
        rating: p.rating ?? 0,
        isPopular: Boolean(p.isPopular),
        isJobReady: Boolean(p.isJobReady),
        modules: Array.isArray(p.modules) && p.modules.length > 0
          ? p.modules.map((m: any) => ({ title: m.title || "", duration: m.duration || "" }))
          : [{ title: "", duration: "" }],
      }))
    : emptyTrainingValues.packages,
  seoTitle: course.seoTitle || "",
  seoDescription: course.seoDescription || "",
  focusKeyword: course.focusKeyword || "",
  canonicalUrl: course.canonicalUrl || "",
  ogImage: course.ogImage || "",
  ogImageAlt: course.ogImageAlt || "",
  seoScore: course.seoScore ?? undefined,
});

export default function EditTrainingPage() {
  const params = useParams<{ slug: string }>();
  const [values, setValues] = useState<TrainingFormValues | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/training/${params.slug}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok || !data.course) throw new Error(data.message || "Failed to load");
        if (mounted) {
          setValues(normalizeValues(data.course));
          setUpdatedAt(data.course.updatedAt || null);
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to load course");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [params.slug]);

  const handleSubmit = async (nextValues: TrainingFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/training/${params.slug}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(nextValues)),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update course");
      toast.success("Course updated");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update course");
      throw e;
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
          Course not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <TrainingForm
      pageTitle="Edit Training Course"
      pageDescription="Update course content, packages, pricing, and SEO metadata."
      initialValues={values}
      submitting={submitting}
      updatedAt={updatedAt}
      onSubmit={handleSubmit}
    />
  );
}
