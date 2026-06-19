"use client";

import DataTable from "@/dashboard/DataTable";
import { Badge, Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type CategoryOption = { _id: string; name: string };
type TagOption = { id: string; name: string; color?: string };

type BlogRecord = {
  id: string;
  _id: string;
  title: string;
  slug: string;
  thumnail?: { url?: string };
  category?: CategoryOption;
  tags: TagOption[];
  published?: boolean;
  updatedAt?: string;
  createdAt?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

export default function BlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogRecord[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadOptions = async () => {
    const [categoriesResponse, tagsResponse] = await Promise.all([
      fetch("/api/categories", { credentials: "include" }),
      fetch("/api/tags", { credentials: "include" }),
    ]);

    const categoriesData = await categoriesResponse.json();
    const tagsData = await tagsResponse.json();

    setCategories(categoriesData.categories || []);
    setTags(tagsData.tags || []);
  };

  const loadPosts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({ limit: "100" });
      if (categoryFilter) params.set("category", categoryFilter);
      if (tagFilter) params.set("tag", tagFilter);
      if (statusFilter) params.set("status", statusFilter);

      const response = await fetch(`/api/blogs?${params.toString()}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load posts");
      }

      setPosts(data.posts || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [categoryFilter, tagFilter, statusFilter]);

  const columns = useMemo(
    () => [
      {
        key: "thumnail" as const,
        label: "Thumbnail",
        render: (post: BlogRecord) =>
          post.thumnail?.url ? (
            <img
              src={post.thumnail.url}
              alt={post.title}
              className="h-12 w-16 rounded-md object-cover"
            />
          ) : (
            <div className="h-12 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ),
      },
      {
        key: "title" as const,
        label: "Title",
        render: (post: BlogRecord) => (
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {post.title}
          </span>
        ),
      },
      {
        key: "category" as const,
        label: "Category",
        render: (post: BlogRecord) =>
          post.category?.name ? <Badge>{post.category.name}</Badge> : "-",
      },
      {
        key: "tags" as const,
        label: "Tags",
        render: (post: BlogRecord) => {
          const visibleTags = (post.tags || []).slice(0, 2);
          const extraCount = Math.max(0, (post.tags || []).length - visibleTags.length);

          return (
            <div className="flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <Badge key={tag.id || tag.name}>{tag.name}</Badge>
              ))}
              {extraCount > 0 && <Badge>+{extraCount} more</Badge>}
            </div>
          );
        },
      },
      { key: "id" as const, label: "SEO Score", render: () => "-" },
      {
        key: "published" as const,
        label: "Status",
        render: (post: BlogRecord) => (
          <Badge>{post.published ? "Published" : "Draft"}</Badge>
        ),
      },
      {
        key: "updatedAt" as const,
        label: "Last Updated",
        render: (post: BlogRecord) => formatDate(post.updatedAt || post.createdAt),
      },
    ],
    []
  );

  const handleDelete = async (post: BlogRecord) => {
    try {
      const response = await fetch(`/api/blogs/${post._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete post");
      }

      setPosts((current) => current.filter((item) => item._id !== post._id));
      toast.success("Post deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete post");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Blog Posts
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage editorial content, SEO fields, categories, and tags.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/blogs/add">New Post</Link>
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-3">
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(event) => setTagFilter(event.target.value)}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <DataTable<BlogRecord>
        columns={columns}
        data={posts}
        loading={loading}
        onEdit={(post) => router.push(`/settings/blogs/${post.slug}`)}
        onDelete={handleDelete}
        emptyMessage="No blog posts found. Create your first post."
      />
    </div>
  );
}
