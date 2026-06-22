"use client";

import DataTable from "@/dashboard/DataTable";
import { Button } from "@/dashboard/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type CategoryRecord = {
  id: string;
  name: string;
  postCount: number;
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
          {mode === "add" ? "Add Category" : "Rename Category"}
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
              placeholder="e.g. Technology"
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

export default function PostCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRecord | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories", { credentials: "include" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load");
      setCategories(
        (data.categories ?? []).map((c: any) => ({
          id: c._id,
          name: c.name,
          postCount: c.postCount ?? 0,
        }))
      );
    } catch (e: any) {
      toast.error(e?.message || "Failed to load categories");
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
        render: (c: CategoryRecord) => (
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {c.name}
          </span>
        ),
      },
      { key: "postCount" as const, label: "Posts" },
    ],
    []
  );

  const openAdd = () => {
    setEditing(null);
    setName("");
    setDialogOpen(true);
  };

  const openEdit = (row: CategoryRecord) => {
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
        editing ? `/api/categories/${editing.id}` : "/api/categories",
        {
          method: editing ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to save");
      toast.success(editing ? "Category renamed" : "Category added");
      closeDialog();
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row: CategoryRecord) => {
    try {
      const res = await fetch(`/api/categories/${row.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete");
      setCategories((prev) => prev.filter((c) => c.id !== row.id));
      toast.success("Category deleted");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete category");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Post Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Organize blog and service posts by topic.
          </p>
        </div>
        <Button type="button" onClick={openAdd}>
          Add Category
        </Button>
      </div>

      <DataTable<CategoryRecord>
        columns={columns}
        data={categories}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
        emptyMessage="No categories yet. Add your first category."
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
