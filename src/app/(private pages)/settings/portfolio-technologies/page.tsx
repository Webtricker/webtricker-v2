"use client";

import DataTable from "@/dashboard/DataTable";
import { Button } from "@/dashboard/ui";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TechnologyRecord = {
  id: string;
  name: string;
  portfolioCount: number;
};

const inputClass =
  "min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

function NameDialog({
  open,
  mode,
  name,
  submitting,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  mode: "add" | "edit";
  name: string;
  submitting: boolean;
  onClose: () => void;
  onChange: (name: string) => void;
  onSubmit: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {mode === "add" ? "Add Technology" : "Rename Technology"}
        </h2>
        <form
          className="mt-5 grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
              Name
            </label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => onChange(e.target.value)}
              className={inputClass}
              placeholder="e.g. React"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Saving…" : mode === "add" ? "Add" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PortfolioTechnologiesPage() {
  const [technologies, setTechnologies] = useState<TechnologyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TechnologyRecord | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio-technologies", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load");
      setTechnologies(
        (data.technologies ?? []).map((t: any) => ({
          id: t._id,
          name: t.name,
          portfolioCount: t.portfolioCount ?? 0,
        }))
      );
    } catch (e: any) {
      toast.error(e?.message || "Failed to load technologies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(
    () => [
      {
        key: "name" as const,
        label: "Name",
        render: (t: TechnologyRecord) => (
          <Link
            href={`/settings/portfolio-technologies/${t.id}`}
            className="font-medium text-zinc-950 underline-offset-2 hover:underline dark:text-zinc-50"
          >
            {t.name}
          </Link>
        ),
      },
      { key: "portfolioCount" as const, label: "Portfolios" },
    ],
    []
  );

  const openAdd = () => {
    setEditing(null);
    setName("");
    setDialogOpen(true);
  };

  const openEdit = (row: TechnologyRecord) => {
    setEditing(row);
    setName(row.name);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setName("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        editing
          ? `/api/portfolio-technologies/${editing.id}`
          : "/api/portfolio-technologies",
        {
          method: editing ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to save");
      toast.success(editing ? "Technology renamed" : "Technology added");
      closeDialog();
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save technology");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row: TechnologyRecord) => {
    try {
      const res = await fetch(`/api/portfolio-technologies/${row.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete");
      setTechnologies((prev) => prev.filter((t) => t.id !== row.id));
      toast.success("Technology deleted");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete technology");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Portfolio Technologies
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Classify portfolio projects by the technology stack used. Click a
            name to view its portfolios.
          </p>
        </div>
        <Button type="button" onClick={openAdd}>
          Add Technology
        </Button>
      </div>

      <DataTable<TechnologyRecord>
        columns={columns}
        data={technologies}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No technologies yet. Add your first technology."
      />

      <NameDialog
        open={dialogOpen}
        mode={editing ? "edit" : "add"}
        name={name}
        submitting={submitting}
        onClose={closeDialog}
        onChange={setName}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
