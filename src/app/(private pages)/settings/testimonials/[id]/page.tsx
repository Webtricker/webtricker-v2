"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TestimonialForm, { TestimonialFormValues } from "../components/TestimonialForm";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<TestimonialFormValues | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadTestimonial = async () => {
      try {
        // Looking up the endpoint for fetching a single testimonial.
        // Wait, the API `GET /api/testimonials/[id]` is what I should use.
        // But the previous implementation used `/api/testimonials/${slug}` in `getTestimonialData`.
        const response = await fetch(`/api/testimonials/${id}`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error("Failed to load testimonial");
        }
        
        // Let's assume the API returns { testimonialData: { ... } } or similar
        const t = data.testimonialData || data.data || data;
        setInitialData({
          name: t.name || "",
          role: t.role || "",
          profile: t.profile || "",
          review: t.review || "",
        });
      } catch (error: any) {
        toast.error("Testimonial not found or error loading");
        router.push("/settings/testimonials");
      } finally {
        setLoading(false);
      }
    };
    loadTestimonial();
  }, [id, router]);

  const handleSubmit = async (values: TestimonialFormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update testimonial");
      }

      toast.success("Testimonial updated successfully");
      router.push("/settings/testimonials");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      <TestimonialForm
        title="Edit Testimonial"
        description="Update the client testimonial information."
        initialValues={initialData}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
