"use client";

import DataTable from "@/dashboard/DataTable";
import { Badge, Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type CareerRecord = {
  id: string;
  title: string;
  department: string;
  location: string;
  vacancyCount: number;
  published: boolean;
  updatedAt?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

export default function CareerListingPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<CareerRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/career", { credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load");
      setCareers(
        (data.careers ?? []).map((career: any) => ({
          id: career.slug,
          title: career.title,
          department: career.department,
          location: career.location,
          vacancyCount: Number(career.vacancyCount) || 0,
          published: Boolean(career.published),
          updatedAt: career.updatedAt,
        }))
      );
    } catch (error: any) {
      toast.error(error?.message || "Failed to load career listings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const columns = useMemo(() => [
    {
      key: "title" as const,
      label: "Title",
      render: (career: CareerRecord) => (
        <span className="font-medium text-zinc-950 dark:text-zinc-50">{career.title}</span>
      ),
    },
    { key: "department" as const, label: "Department" },
    { key: "location" as const, label: "Location" },
    {
      key: "vacancyCount" as const,
      label: "Vacancy",
      render: (career: CareerRecord) => <Badge>{career.vacancyCount}</Badge>,
    },
    {
      key: "published" as const,
      label: "Status",
      render: (career: CareerRecord) =>
        career.published
          ? <Badge>Published</Badge>
          : <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">Draft</span>,
    },
    {
      key: "updatedAt" as const,
      label: "Last Updated",
      render: (career: CareerRecord) => formatDate(career.updatedAt),
    },
  ], []);

  const handleDelete = async (career: CareerRecord) => {
    try {
      const res = await fetch(`/api/career/${career.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete");
      setCareers((current) => current.filter((item) => item.id !== career.id));
      toast.success("Career listing deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete career listing");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Career Listings</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage open positions, application instructions, and SEO metadata.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/career/add">New Listing</Link>
        </Button>
      </div>

      <DataTable<CareerRecord>
        columns={columns}
        data={careers}
        loading={loading}
        onEdit={(career) => router.push(`/settings/career/${career.id}`)}
        onDelete={handleDelete}
        emptyMessage="No career listings yet. Create your first listing."
      />
    </div>
  );
}
