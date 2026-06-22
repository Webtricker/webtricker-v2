"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import TestimonialForm, { TestimonialFormValues } from "../components/TestimonialForm";

export default function AddTestimonialPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: TestimonialFormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add testimonial");
      }

      toast.success("Testimonial added successfully");
      router.push("/settings/testimonials");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      <TestimonialForm
        title="Add Testimonial"
        description="Add a new client testimonial to display on the website."
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
