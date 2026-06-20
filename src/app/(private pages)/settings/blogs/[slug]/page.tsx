"use client";

import { Card, CardContent } from "@/dashboard/ui";
import { useParams, useRouter } from "next/navigation";
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
});

export default function EditBlogPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues | null>(null);
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

        if (mounted) setValues(normalizeBlogValues(data.post));
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
      router.push("/settings/blogs");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Edit Blog Post
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update content, media, tags, and SEO metadata.
          </p>
        </div>
        <a
          href="/settings/blogs"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Back
        </a>
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
