"use client";

import DataTable from "@/dashboard/DataTable";
import { Badge, Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TrainingRecord = {
  id: string; // same as slug — used as DataTable key and API identifier
  title: string;
  packageCount: number;
  startingFrom: number;
  published: boolean;
  updatedAt?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(d);
};

export default function TrainingListingPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/training", { credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load");
      setCourses(
        (data.courses ?? []).map((c: any) => ({
          id: c.slug,
          title: c.title,
          packageCount: Array.isArray(c.packages) ? c.packages.length : 0,
          startingFrom: Array.isArray(c.packages) && c.packages.length > 0
            ? Math.min(...c.packages.map((p: any) => p.totalFee ?? Infinity))
            : 0,
          published: Boolean(c.published),
          updatedAt: c.updatedAt,
        }))
      );
    } catch (e: any) {
      toast.error(e?.message || "Failed to load training courses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const columns = useMemo(() => [
    {
      key: "title" as const,
      label: "Title",
      render: (c: TrainingRecord) => (
        <span className="font-medium text-zinc-950 dark:text-zinc-50">{c.title}</span>
      ),
    },
    {
      key: "packageCount" as const,
      label: "Packages",
      render: (c: TrainingRecord) => (
        <Badge>{c.packageCount} package{c.packageCount !== 1 ? "s" : ""}</Badge>
      ),
    },
    {
      key: "startingFrom" as const,
      label: "Starting From",
      render: (c: TrainingRecord) =>
        c.startingFrom > 0
          ? <span className="text-sm">৳{c.startingFrom.toLocaleString()}</span>
          : <span className="text-zinc-400 text-sm">—</span>,
    },
    {
      key: "published" as const,
      label: "Status",
      render: (c: TrainingRecord) =>
        c.published
          ? <Badge>Published</Badge>
          : <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">Draft</span>,
    },
    {
      key: "updatedAt" as const,
      label: "Last Updated",
      render: (c: TrainingRecord) => formatDate(c.updatedAt),
    },
  ], []);

  const handleDelete = async (c: TrainingRecord) => {
    try {
      const res = await fetch(`/api/training/${c.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete");
      setCourses((prev) => prev.filter((item) => item.id !== c.id));
      toast.success("Course deleted");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete course");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Training</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage training courses, packages, and pricing.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/training/add">New Course</Link>
        </Button>
      </div>

      <DataTable<TrainingRecord>
        columns={columns}
        data={courses}
        loading={loading}
        onEdit={(c) => router.push(`/settings/training/${c.id}`)}
        onDelete={handleDelete}
        emptyMessage="No training courses yet. Create your first course."
      />
    </div>
  );
}
