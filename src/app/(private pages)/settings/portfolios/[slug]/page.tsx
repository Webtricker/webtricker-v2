"use client";

import { Card, CardContent } from "@/dashboard/ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PortfolioForm, {
  PortfolioFormValues,
  emptyPortfolioValues,
} from "../components/PortfolioForm";

const normalizePortfolioValues = (portfolio: any): PortfolioFormValues => ({
  ...emptyPortfolioValues,
  title: portfolio?.title || "",
  slug: portfolio?.slug || "",
  thumnail: portfolio?.thumnail?.url || "",
  thumbnailAlt: portfolio?.thumbnailAlt || "",
  thumbnailTitle: portfolio?.thumbnailTitle || "",
  coverImage: portfolio?.coverImage?.url || "",
  coverImageAlt: portfolio?.coverImageAlt || "",
  technology: portfolio?.technology?._id || portfolio?.technology || "",
  tags: Array.isArray(portfolio?.tags)
    ? portfolio.tags.map((tag: any) => String(tag?.id || tag?._id || tag))
    : [],
  description: portfolio?.description || "",
  excerp: portfolio?.excerp || "",
  liveLink: portfolio?.liveLink || "",
  content: portfolio?.content || "",
  featured: Boolean(portfolio?.featured),
  seoTitle: portfolio?.seoTitle || "",
  seoDescription: portfolio?.seoDescription || "",
  focusKeyword: portfolio?.focusKeyword || "",
  canonicalUrl: portfolio?.canonicalUrl || "",
  ogImage: portfolio?.ogImage || "",
  ogImageAlt: portfolio?.ogImageAlt || "",
});

export default function EditPortfolioPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [values, setValues] = useState<PortfolioFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolios/${params.slug}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !data.portfolio) {
          throw new Error(data.message || "Failed to load portfolio");
        }

        if (mounted) setValues(normalizePortfolioValues(data.portfolio));
      } catch (error: any) {
        toast.error(error?.message || "Failed to load portfolio");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPortfolio();

    return () => {
      mounted = false;
    };
  }, [params.slug]);

  const handleSubmit = async (nextValues: PortfolioFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/portfolios/${params.slug}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextValues),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update portfolio");
      }

      toast.success("Portfolio updated");
      router.push("/settings/portfolios");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update portfolio");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Edit Portfolio
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update portfolio content, media, tags, and SEO metadata.
          </p>
        </div>
        <a
          href="/settings/portfolios"
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
        <PortfolioForm
          title="Portfolio Details"
          description="Write the case study content and metadata."
          initialValues={values}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      ) : (
        <Card>
          <CardContent className="pt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Portfolio item not found.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
