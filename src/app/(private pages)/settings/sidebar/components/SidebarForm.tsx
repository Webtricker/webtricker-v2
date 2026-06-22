"use client";

import ImageUploader from "@/dashboard/ImageUploader";
import { Card, CardContent, CardHeader } from "@/dashboard/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type SidebarValues = {
  shortLogo: string;
  title: string;
  description: string;
  information: { title: string };
  socialLinks: { title: string };
};

const DEFAULTS: SidebarValues = {
  shortLogo: "",
  title: "",
  description: "",
  information: { title: "" },
  socialLinks: { title: "" },
};

const inputClass =
  "min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

export default function SidebarForm() {
  const [values, setValues] = useState<SidebarValues>(DEFAULTS);
  const [logoAlt, setLogoAlt] = useState("Webtricker short logo");
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/sidebar", { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setDocId(d._id);
          setValues({
            shortLogo: d.shortLogo ?? "",
            title: d.title ?? "",
            description: d.description ?? "",
            information: { title: d.information?.title ?? "" },
            socialLinks: { title: d.socialLinks?.title ?? "" },
          });
        }
      } catch {
        toast.error("Failed to load sidebar data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!docId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/sidebar", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId, data: values }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Save failed");
      toast.success("Sidebar saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save sidebar");
    } finally {
      setSubmitting(false);
    }
  };

  const set = <K extends keyof SidebarValues>(key: K, value: SidebarValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const setNested = <K extends "information" | "socialLinks">(
    section: K,
    field: keyof SidebarValues[K],
    value: string,
  ) =>
    setValues((v) => ({
      ...v,
      [section]: { ...(v[section] as object), [field]: value },
    }));

  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-36 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Sticky page header */}
      <div className="sticky top-16 z-[25] -mx-4 flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Sidebar</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Short logo, title, description, and section headings.
          </p>
        </div>
        <button
          type="submit"
          form="sidebar-form"
          disabled={submitting}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>

      <form id="sidebar-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ── Short Logo ────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Short Logo</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Small icon/mark shown at the top of the mobile sidebar panel.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 max-w-xs">
              <ImageUploader
                value={values.shortLogo}
                onChange={(url) => set("shortLogo", url)}
                altText={logoAlt}
                onAltTextChange={setLogoAlt}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Title ─────────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Title</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Heading text shown in the mobile sidebar.
            </p>
          </CardHeader>
          <CardContent>
            <input
              className={inputClass}
              value={values.title}
              placeholder="Your Digital Partner for Success"
              onChange={(e) => set("title", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* ── Description ───────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Description</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Short blurb shown below the title in the mobile sidebar.
            </p>
          </CardHeader>
          <CardContent>
            <textarea
              className={`${inputClass} min-h-[120px] resize-y py-2.5`}
              value={values.description}
              placeholder="Looking for a reliable digital partner?…"
              onChange={(e) => set("description", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* ── Information Section Heading ───────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Information Section Heading
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Label shown above the contact details block in the sidebar.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Section Title
              </label>
              <input
                className={inputClass}
                value={values.information.title}
                placeholder="INFORMATION"
                onChange={(e) => setNested("information", "title", e.target.value)}
              />
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Contact info (phones, emails, addresses) has moved to{" "}
              <Link
                href="/settings/site-config"
                className="font-medium text-zinc-950 underline underline-offset-2 dark:text-zinc-50"
              >
                Site Settings
              </Link>
              .
            </div>
          </CardContent>
        </Card>

        {/* ── Social Links Section Heading ──────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Social Links Section Heading
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Section Title
              </label>
              <input
                className={inputClass}
                value={values.socialLinks.title}
                placeholder="FOLLOW US"
                onChange={(e) => setNested("socialLinks", "title", e.target.value)}
              />
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Social links have moved to{" "}
              <Link
                href="/settings/site-config"
                className="font-medium text-zinc-950 underline underline-offset-2 dark:text-zinc-50"
              >
                Site Settings
              </Link>
              .
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
