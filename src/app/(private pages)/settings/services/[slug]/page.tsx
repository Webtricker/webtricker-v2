"use client";

import { Card, CardContent } from "@/dashboard/ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ServiceForm, {
  ServiceFormValues,
  emptyServiceValues,
} from "../components/ServiceForm";

const normalizeServiceValues = (service: any): ServiceFormValues => ({
  ...emptyServiceValues,
  title: service?.title || "",
  slug: service?.slug || "",
  icon: service?.icon || "",
  thumnail: service?.thumnail?.url || "",
  thumbnailAlt: service?.thumbnailAlt || "",
  thumbnailTitle: service?.thumbnailTitle || "",
  category: service?.category || "",
  tags: Array.isArray(service?.tags)
    ? service.tags.map((tag: any) => String(tag?.id || tag?._id || tag))
    : [],
  excerpt: service?.excerpt || "",
  subServices: Array.isArray(service?.subServices) ? service.subServices : [],
  content: service?.content || "",
  author: service?.author || "",
  seoTitle: service?.seoTitle || "",
  seoDescription: service?.seoDescription || "",
  focusKeyword: service?.focusKeyword || "",
  canonicalUrl: service?.canonicalUrl || "",
  ogImage: service?.ogImage || "",
  ogImageAlt: service?.ogImageAlt || "",
});

export default function EditServicePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [values, setValues] = useState<ServiceFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadService = async () => {
      try {
        const response = await fetch(`/api/services/${params.slug}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !data.service) {
          throw new Error(data.message || "Failed to load service");
        }

        if (mounted) setValues(normalizeServiceValues(data.service));
      } catch (error: any) {
        toast.error(error?.message || "Failed to load service");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadService();

    return () => {
      mounted = false;
    };
  }, [params.slug]);

  const handleSubmit = async (nextValues: ServiceFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/services/${params.slug}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextValues),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update service");
      }

      toast.success("Service updated");
      router.push("/settings/services");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Edit Service
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update service content, media, tags, and SEO metadata.
          </p>
        </div>
        <a
          href="/settings/services"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Back
        </a>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-4">
            <div className="h-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </CardContent>
        </Card>
      ) : values ? (
        <ServiceForm
          title="Service Details"
          description="Write the service content and metadata."
          initialValues={values}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      ) : (
        <Card>
          <CardContent className="pt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Service not found.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
