"use client";

import DataTable from "@/dashboard/DataTable";
import { Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TestimonialRecord = {
  id: string;
  _id: string;
  name: string;
  role: string;
  profile: string;
  review: string;
};

const normalizeTestimonial = (testimonial: any): TestimonialRecord => ({
  id: testimonial.id || testimonial._id,
  _id: testimonial._id || testimonial.id,
  name: testimonial.name || "",
  role: testimonial.role || "",
  profile: testimonial.profile || "",
  review: testimonial.review || "",
});

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/testimonials", {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load testimonials");
      }

      setTestimonials((data.testimonialsData || []).map(normalizeTestimonial));
    } catch (error: any) {
      toast.error(error?.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "profile" as const,
        label: "Photo",
        render: (item: TestimonialRecord) =>
          item.profile ? (
            <img
              src={item.profile}
              alt={item.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ),
      },
      {
        key: "name" as const,
        label: "Name",
        render: (item: TestimonialRecord) => (
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {item.name}
          </span>
        ),
      },
      { key: "role" as const, label: "Role / Company" },
      {
        key: "review" as const,
        label: "Review Snippet",
        render: (item: TestimonialRecord) => (
          <span className="truncate max-w-[300px] block" title={item.review}>
            {item.review}
          </span>
        ),
      },
    ],
    []
  );

  const handleDelete = async (item: TestimonialRecord) => {
    try {
      const response = await fetch(`/api/testimonials/${item._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete testimonial");
      }

      setTestimonials((current) => current.filter((t) => t._id !== item._id));
      toast.success("Testimonial deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete testimonial");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage what your clients say about you across the website.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/testimonials/add">Add Testimonial</Link>
        </Button>
      </div>

      <DataTable<TestimonialRecord>
        columns={columns}
        data={testimonials}
        loading={loading}
        onEdit={(item) => router.push(`/settings/testimonials/${item._id}`)}
        onDelete={handleDelete}
        emptyMessage="No testimonials found. Add your first testimonial."
      />
    </div>
  );
}
