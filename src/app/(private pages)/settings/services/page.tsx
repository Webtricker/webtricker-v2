"use client";

import DataTable from "@/dashboard/DataTable";
import { Badge, Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TagOption = { id: string; name: string; color?: string };

type ServiceRecord = {
  id: string;
  _id: string;
  title: string;
  slug: string;
  icon?: string;
  category?: string;
  tags: TagOption[];
  updatedAt?: string;
  createdAt?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(services.map((service) => service.category).filter(Boolean))
      ).sort() as string[],
    [services]
  );

  const loadTags = async () => {
    try {
      const response = await fetch("/api/tags", { credentials: "include" });
      const data = await response.json();
      if (!response.ok) return;
      setTags(data.tags || []);
    } catch {
      setTags([]);
    }
  };

  const loadServices = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({ limit: "100" });
      if (categoryFilter) params.set("category", categoryFilter);
      if (tagFilter) params.set("tag", tagFilter);

      const response = await fetch(`/api/services?${params.toString()}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load services");
      }

      setServices(data.services || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    loadServices();
  }, [categoryFilter, tagFilter]);

  const columns = useMemo(
    () => [
      {
        key: "icon" as const,
        label: "Icon",
        render: (service: ServiceRecord) =>
          service.icon ? (
            <img
              src={service.icon}
              alt={service.title}
              className="h-10 w-10 rounded-md object-contain"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ),
      },
      {
        key: "title" as const,
        label: "Title",
        render: (service: ServiceRecord) => (
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {service.title}
          </span>
        ),
      },
      {
        key: "category" as const,
        label: "Category",
        render: (service: ServiceRecord) =>
          service.category ? <Badge>{service.category}</Badge> : "-",
      },
      {
        key: "tags" as const,
        label: "Tags",
        render: (service: ServiceRecord) => {
          const visibleTags = (service.tags || []).slice(0, 2);
          const extraCount = Math.max(
            0,
            (service.tags || []).length - visibleTags.length
          );

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
        key: "updatedAt" as const,
        label: "Last Updated",
        render: (service: ServiceRecord) =>
          formatDate(service.updatedAt || service.createdAt),
      },
    ],
    []
  );

  const handleDelete = async (service: ServiceRecord) => {
    try {
      const response = await fetch(`/api/services/${service._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete service");
      }

      setServices((current) => current.filter((item) => item._id !== service._id));
      toast.success("Service deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete service");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Services
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage service content, media, taxonomy, and SEO metadata.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/services/add">New Service</Link>
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2">
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
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
      </div>

      <DataTable<ServiceRecord>
        columns={columns}
        data={services}
        loading={loading}
        onEdit={(service) => router.push(`/settings/services/${service.slug}`)}
        onDelete={handleDelete}
        emptyMessage="No services found. Create your first service."
      />
    </div>
  );
}
