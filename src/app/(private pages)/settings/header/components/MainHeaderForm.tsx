"use client";

import ImageUploader from "@/dashboard/ImageUploader";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type NavLink = {
  label: string;
  href: string;
  isExternal: boolean;
};

type MainHeaderValues = {
  logo: { white: string; black: string };
  links: NavLink[];
};

const EMPTY_LINK: NavLink = { label: "", href: "", isExternal: false };

const inputClass =
  "min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

const removeBtn =
  "shrink-0 rounded-md border border-zinc-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:border-zinc-800 dark:hover:bg-red-950/20";

export default function MainHeaderForm() {
  const [values, setValues] = useState<MainHeaderValues>({
    logo: { white: "", black: "" },
    links: [],
  });
  // alt text is tracked locally only — MainHeader model has no alt text fields,
  // but ImageUploader requires non-empty alt text to enable form submission
  const [logoLightAlt, setLogoLightAlt] = useState("Webtricker Logo Light");
  const [logoDarkAlt, setLogoDarkAlt] = useState("Webtricker Logo Dark");
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/main-header", { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setDocId(d._id);
          setValues({
            logo: { white: d.logo?.white ?? "", black: d.logo?.black ?? "" },
            links: (d.links ?? []).map((l: NavLink) => ({
              label: l.label ?? "",
              href: l.href ?? "",
              isExternal: l.isExternal ?? false,
            })),
          });
        }
      } catch {
        toast.error("Failed to load header data");
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
      const res = await fetch("/api/main-header", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId, data: values }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Save failed");
      toast.success("Header saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save header");
    } finally {
      setSubmitting(false);
    }
  };

  // ── logo ─────────────────────────────────────────────────────────────────
  const setLogoWhite = (url: string) =>
    setValues((v) => ({ ...v, logo: { ...v.logo, white: url } }));
  const setLogoBlack = (url: string) =>
    setValues((v) => ({ ...v, logo: { ...v.logo, black: url } }));

  // ── links ─────────────────────────────────────────────────────────────────
  const addLink = () =>
    setValues((v) => ({ ...v, links: [...v.links, { ...EMPTY_LINK }] }));

  const updateLink = (index: number, field: keyof NavLink, value: string | boolean) =>
    setValues((v) => {
      const links = [...v.links];
      links[index] = { ...links[index], [field]: value };
      return { ...v, links };
    });

  const removeLink = (index: number) =>
    setValues((v) => ({ ...v, links: v.links.filter((_, i) => i !== index) }));

  // ── render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="h-16 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-80 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Redirect notice replacing dead TopHeaderForm */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Contact info and social links have moved to{" "}
        <Link
          href="/settings/site-config"
          className="font-medium text-zinc-950 underline underline-offset-2 dark:text-zinc-50"
        >
          Site Settings
        </Link>
        .
      </div>

      {/* Sticky page header */}
      <div className="sticky top-16 z-[25] -mx-4 flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Header</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Site logo and navigation links.
          </p>
        </div>
        <button
          type="submit"
          form="main-header-form"
          disabled={submitting}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>

      <form id="main-header-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ── Logos ──────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Logo</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Light logo shown on dark backgrounds; dark logo shown on light backgrounds.
            </p>
          </CardHeader>
          <CardContent className="grid gap-8 lg:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Light Logo{" "}
                <span className="font-normal text-zinc-400">(white / transparent — dark mode)</span>
              </label>
              <ImageUploader
                value={values.logo.white}
                onChange={setLogoWhite}
                altText={logoLightAlt}
                onAltTextChange={setLogoLightAlt}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Dark Logo{" "}
                <span className="font-normal text-zinc-400">(colored / dark — light mode)</span>
              </label>
              <ImageUploader
                value={values.logo.black}
                onChange={setLogoBlack}
                altText={logoDarkAlt}
                onAltTextChange={setLogoDarkAlt}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Navigation Links ───────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Navigation Links
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Shown in the desktop navbar and mobile sidebar menu. Order is preserved.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {values.links.map((link, i) => (
              <div
                key={i}
                className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="grid gap-1.5 min-w-[160px]">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Label
                  </label>
                  <input
                    className={`${inputClass} !min-h-9`}
                    value={link.label}
                    placeholder="About"
                    onChange={(e) => updateLink(i, "label", e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5 grow min-w-[180px]">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    URL
                  </label>
                  <input
                    className={`${inputClass} !min-h-9`}
                    value={link.href}
                    placeholder="/about"
                    onChange={(e) => updateLink(i, "href", e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    New tab
                  </label>
                  <button
                    type="button"
                    onClick={() => updateLink(i, "isExternal", !link.isExternal)}
                    className={`h-6 w-11 rounded-full p-1 transition ${
                      link.isExternal
                        ? "bg-zinc-950 dark:bg-zinc-50"
                        : "bg-zinc-300 dark:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white transition dark:bg-zinc-950 ${
                        link.isExternal ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <button type="button" onClick={() => removeLink(i)} className={removeBtn}>
                  Remove
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addLink}>
              + Add Link
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
