"use client";

import { useCurrentDashboardUser } from "@/dashboard/auth";
import DataTable from "@/dashboard/DataTable";
import SlugInput from "@/dashboard/SlugInput";
import { Button, Card, CardContent } from "@/dashboard/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TagRecord = {
  id: string;
  name: string;
  slug: string;
  color: string;
  postCount: number;
  createdAt?: string;
};

type TagFormValues = {
  name: string;
  slug: string;
  color: string;
};

const brandColor = "#4F46E5";
const colorSwatches = [brandColor, "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"];

const emptyForm: TagFormValues = {
  name: "",
  slug: "",
  color: brandColor,
};

const canManageTags = (role?: string) =>
  role === "superAdmin" || role === "editor";

function TagDialog({
  open,
  mode,
  values,
  submitting,
  existingSlugs,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  mode: "add" | "edit";
  values: TagFormValues;
  submitting: boolean;
  existingSlugs: string[];
  onClose: () => void;
  onChange: <Key extends keyof TagFormValues>(
    key: Key,
    value: TagFormValues[Key]
  ) => void;
  onSubmit: () => void;
}) {
  const updateSlug = useCallback(
    (value: string) => onChange("slug", value),
    [onChange]
  );

  if (!open) return null;

  const duplicateSlug = Boolean(
    values.slug && existingSlugs.includes(values.slug)
  );

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {mode === "add" ? "Add Tag" : "Edit Tag"}
        </h2>
        <form
          className="mt-5 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <input
              required
              value={values.name}
              onChange={(event) => onChange("name", event.target.value)}
              className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
            />
          </div>

          <SlugInput
            value={values.slug}
            onChange={updateSlug}
            sourceValue={values.name}
            existingSlugs={existingSlugs}
          />

          <div className="grid gap-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex flex-wrap items-center gap-3">
              {colorSwatches.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onChange("color", color)}
                  aria-label={`Use color ${color}`}
                  className={`h-8 w-8 rounded-full border ${
                    values.color === color
                      ? "border-zinc-950 ring-2 ring-zinc-300 dark:border-zinc-50 dark:ring-zinc-700"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={values.color}
                onChange={(event) => onChange("color", event.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-zinc-200 bg-transparent p-1 dark:border-zinc-800"
              />
            </div>
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
            <Button type="submit" disabled={submitting || duplicateSlug}>
              {submitting ? "Saving..." : mode === "add" ? "Add Tag" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TagsPage() {
  const router = useRouter();
  const { user: currentUser, loading: userLoading } = useCurrentDashboardUser();
  const [tags, setTags] = useState<TagRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagRecord | null>(null);
  const [formValues, setFormValues] = useState<TagFormValues>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const allowed = canManageTags(currentUser?.role);

  const loadTags = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/tags", {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load tags");
      }

      setTags(data.tags || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load tags");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userLoading) return;
    if (!allowed) {
      router.replace("/settings");
      return;
    }

    loadTags();
  }, [allowed, loadTags, router, userLoading]);

  const columns = useMemo(
    () => [
      {
        key: "color" as const,
        label: "Color",
        render: (tag: TagRecord) => (
          <span
            className="block h-5 w-5 rounded-full border border-zinc-200 dark:border-zinc-800"
            style={{ backgroundColor: tag.color }}
          />
        ),
      },
      {
        key: "name" as const,
        label: "Name",
        render: (tag: TagRecord) => (
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {tag.name}
          </span>
        ),
      },
      { key: "slug" as const, label: "Slug" },
      { key: "postCount" as const, label: "Post Count" },
    ],
    []
  );

  const existingSlugs = useMemo(
    () =>
      tags
        .filter((tag) => tag.id !== editingTag?.id)
        .map((tag) => tag.slug),
    [editingTag?.id, tags]
  );

  const updateFormValue = useCallback(
    <Key extends keyof TagFormValues>(key: Key, value: TagFormValues[Key]) => {
      setFormValues((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const openAddDialog = () => {
    setEditingTag(null);
    setFormValues(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (tag: TagRecord) => {
    setEditingTag(tag);
    setFormValues({
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTag(null);
    setFormValues(emptyForm);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(
        editingTag ? `/api/tags/${editingTag.id}` : "/api/tags",
        {
          method: editingTag ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save tag");
      }

      toast.success(editingTag ? "Tag updated" : "Tag created");
      closeDialog();
      await loadTags();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save tag");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tag: TagRecord) => {
    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete tag");
      }

      setTags((current) => current.filter((item) => item.id !== tag.id));
      toast.success("Tag deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete tag");
    }
  };

  if (userLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card>
          <CardContent className="pt-4">
            <div className="h-40 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Tags
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage reusable post tags for future content workflows.
          </p>
        </div>
        <Button type="button" onClick={openAddDialog}>
          Add Tag
        </Button>
      </div>

      <DataTable<TagRecord>
        columns={columns}
        data={tags}
        loading={loading}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        emptyMessage="No tags found. Add your first tag."
      />

      <TagDialog
        open={dialogOpen}
        mode={editingTag ? "edit" : "add"}
        values={formValues}
        submitting={submitting}
        existingSlugs={existingSlugs}
        onClose={closeDialog}
        onChange={updateFormValue}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
