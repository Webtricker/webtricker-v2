"use client";

import { Button } from "@/dashboard/ui";
import Link from "next/link";
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            New Portfolio
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create a portfolio item with media, technology, tags, and SEO metadata.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/settings/portfolios">Back</Link>
        </Button>
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
