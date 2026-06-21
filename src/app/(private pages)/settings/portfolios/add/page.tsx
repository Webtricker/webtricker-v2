"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import PortfolioForm, {
  PortfolioFormValues,
  emptyPortfolioValues,
} from "../components/PortfolioForm";

export default function AddPortfolioPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: PortfolioFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: values }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create portfolio");
      }

      toast.success("Portfolio created");
      router.push("/settings/portfolios");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create portfolio");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="sticky top-16 z-[25] -mx-4 flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            New Portfolio
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Create a portfolio item with media, technology, tags, and SEO metadata.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="submit"
            form="portfolio-edit-form"
            disabled={submitting}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {submitting ? "Saving…" : "Save Portfolio"}
          </button>
          <a
            href="/settings/portfolios"
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Back
          </a>
        </div>
      </div>

      <PortfolioForm
        title="Portfolio Details"
        description="Write the case study content and metadata."
        initialValues={emptyPortfolioValues}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
