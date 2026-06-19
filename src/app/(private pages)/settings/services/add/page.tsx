"use client";

import { Button } from "@/dashboard/ui";
import Link from "next/link";
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
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            New Service
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create a service with media, taxonomy, content, and SEO metadata.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/settings/services">Back</Link>
        </Button>
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
