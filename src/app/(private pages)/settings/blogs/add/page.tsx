"use client";

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
        <Link
          href="/settings/blogs"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Back
        </Link>
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
