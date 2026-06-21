"use client";

import { Card, CardContent } from "@/dashboard/ui";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BlogForm, { BlogFormValues, emptyBlogValues } from "../components/BlogForm";

const normalizeBlogValues = (post: any): BlogFormValues => ({
  ...emptyBlogValues,
  title: post?.title || "",
  slug: post?.slug || "",
  thumnail: post?.thumnail?.url || "",
  thumbnailAlt: post?.thumbnailAlt || "",
  thumbnailTitle: post?.thumbnailTitle || "",
  category: post?.category?._id || post?.category || "",
  tags: Array.isArray(post?.tags)
    ? post.tags.map((tag: any) => String(tag?.id || tag?._id || tag))
    : [],
  content: post?.content || "",
  excerp: post?.excerp || "",
  author: post?.author || "",
  readingTime: post?.readingTime,
  featured: Boolean(post?.featured),
  published: Boolean(post?.published),
  seoTitle: post?.seoTitle || "",
  seoDescription: post?.seoDescription || "",
  focusKeyword: post?.focusKeyword || "",
  canonicalUrl: post?.canonicalUrl || "",
  ogImage: post?.ogImage || "",
  ogImageAlt: post?.ogImageAlt || "",
  seoScore: post?.seoScore ?? undefined,
});

export default function EditBlogPage() {
  const params = useParams<{ slug: string }>();
  const [values, setValues] = useState<BlogFormValues | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.slug}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !data.post) {
          throw new Error(data.message || "Failed to load post");
        }

        if (mounted) {
          setValues(normalizeBlogValues(data.post));
          setUpdatedAt(data.post.updatedAt || null);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to load post");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPost();

    return () => {
      mounted = false;
    };
  }, [params.slug]);

  const handleSubmit = async (nextValues: BlogFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/blogs/${params.slug}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextValues),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update post");
      }

      toast.success("Post updated");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="sticky top-16 z-[25] -mx-4 flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Edit Blog Post
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Update content, media, tags, and SEO metadata.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="submit"
            form="blog-edit-form"
            disabled={submitting || loading}
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {submitting ? "Saving…" : "Save Post"}
          </button>
          <a
            href="/settings/blogs"
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Back
          </a>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-4">
            <div className="h-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </CardContent>
        </Card>
      ) : values ? (
        <BlogForm
          title="Post Details"
          description="Write the core post content and metadata."
          initialValues={values}
          submitting={submitting}
          updatedAt={updatedAt}
          onSubmit={handleSubmit}
        />
      ) : (
        <Card>
          <CardContent className="pt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Blog post not found.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
