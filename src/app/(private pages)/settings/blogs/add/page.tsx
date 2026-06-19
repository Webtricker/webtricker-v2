"use client";

import { Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import BlogForm, { BlogFormValues, emptyBlogValues } from "../components/BlogForm";

export default function AddBlogPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: BlogFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create post");
      }

      toast.success("Post created");
      router.push("/settings/blogs");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            New Blog Post
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create a blog post with content, media, tags, and SEO metadata.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/settings/blogs">Back</Link>
        </Button>
      </div>

      <BlogForm
        title="Post Details"
        description="Write the core post content and metadata."
        initialValues={emptyBlogValues}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
