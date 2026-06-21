"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import ServiceForm, {
  ServiceFormValues,
  emptyServiceValues,
} from "../components/ServiceForm";

export default function AddServicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: ServiceFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: values }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create service");
      }

      toast.success("Service created");
      router.push("/settings/services");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="sticky top-16 z-[25] -mx-4 flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            New Service
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Create a service with media, taxonomy, content, and SEO metadata.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="submit"
            form="service-edit-form"
            disabled={submitting}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {submitting ? "Saving…" : "Save Service"}
          </button>
          <a
            href="/settings/services"
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Back
          </a>
        </div>
      </div>

      <ServiceForm
        title="Service Details"
        description="Write the service content and metadata."
        initialValues={emptyServiceValues}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
