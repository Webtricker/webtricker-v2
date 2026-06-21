"use client";

import ImageUploader from "@/dashboard/ImageUploader";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type FooterLink = {
  label: string;
  href: string;
  isExternal: boolean;
};

type LinkSection = {
  title: string;
  links: FooterLink[];
};

type FooterValues = {
  logo: { white: string; black: string };
  description: string;
  pages: LinkSection;
  services: LinkSection;
  socialLinks: { title: string };
  newsLater: { title: string; placeholder: string; formMail: string };
  bounchingTxt: string;
  copyrightTxt: string;
};

const DEFAULTS: FooterValues = {
  logo: { white: "", black: "" },
  description: "",
  pages: { title: "", links: [] },
  services: { title: "", links: [] },
  socialLinks: { title: "" },
  newsLater: { title: "", placeholder: "", formMail: "" },
  bounchingTxt: "",
  copyrightTxt: "",
};

const EMPTY_LINK: FooterLink = { label: "", href: "", isExternal: false };

const inputClass =
  "min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

const removeBtn =
  "shrink-0 rounded-md border border-zinc-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:border-zinc-800 dark:hover:bg-red-950/20";

function LinkListEditor({
  links,
  onChange,
}: {
  links: FooterLink[];
  onChange: (links: FooterLink[]) => void;
}) {
  const add = () => onChange([...links, { ...EMPTY_LINK }]);
  const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof FooterLink, value: string | boolean) => {
    const next = [...links];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      {links.map((link, i) => (
        <div
          key={i}
          className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
        >
          <div className="grid gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Label</label>
            <input
              className={`${inputClass} !min-h-9`}
              value={link.label}
              placeholder="About"
              onChange={(e) => update(i, "label", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5 grow min-w-[180px]">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">URL</label>
            <input
              className={`${inputClass} !min-h-9`}
              value={link.href}
              placeholder="/about"
              onChange={(e) => update(i, "href", e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">New tab</label>
            <button
              type="button"
              onClick={() => update(i, "isExternal", !link.isExternal)}
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
          <button type="button" onClick={() => remove(i)} className={removeBtn}>
            Remove
          </button>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={add}>
        + Add Link
      </Button>
    </div>
  );
}

export default function FooterForm() {
  const [values, setValues] = useState<FooterValues>(DEFAULTS);
  const [logoLightAlt, setLogoLightAlt] = useState("Webtricker Logo Light");
  const [logoDarkAlt, setLogoDarkAlt] = useState("Webtricker Logo Dark");
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/footer", { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setDocId(d._id);
          setValues({
            logo: { white: d.logo?.white ?? "", black: d.logo?.black ?? "" },
            description: d.description ?? "",
            pages: {
              title: d.pages?.title ?? "",
              links: (d.pages?.links ?? []).map((l: FooterLink) => ({
                label: l.label ?? "",
                href: l.href ?? "",
                isExternal: l.isExternal ?? false,
              })),
            },
            services: {
              title: d.services?.title ?? "",
              links: (d.services?.links ?? []).map((l: FooterLink) => ({
                label: l.label ?? "",
                href: l.href ?? "",
                isExternal: l.isExternal ?? false,
              })),
            },
            socialLinks: { title: d.socialLinks?.title ?? "" },
            newsLater: {
              title: d.newsLater?.title ?? "",
              placeholder: d.newsLater?.placeholder ?? "",
              formMail: d.newsLater?.formMail ?? "",
            },
            bounchingTxt: d.bounchingTxt ?? "",
            copyrightTxt: d.copyrightTxt ?? "",
          });
        }
      } catch {
        toast.error("Failed to load footer data");
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
      const res = await fetch("/api/footer", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId, data: values }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Save failed");
      toast.success("Footer saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save footer");
    } finally {
      setSubmitting(false);
    }
  };

  // ── typed helpers ──────────────────────────────────────────────────────────
  const set = <K extends keyof FooterValues>(key: K, value: FooterValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const setNested = <K extends "pages" | "services" | "newsLater" | "socialLinks">(
    section: K,
    field: keyof FooterValues[K],
    value: any,
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
            className="h-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
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
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Footer</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Logo, links, newsletter, and copyright text.
          </p>
        </div>
        <button
          type="submit"
          form="footer-form"
          disabled={submitting}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>

      <form id="footer-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ── Logo ──────────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Logo</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Light logo is shown in the footer (always dark background).
            </p>
          </CardHeader>
          <CardContent className="grid gap-8 lg:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Light Logo{" "}
                <span className="font-normal text-zinc-400">(white / transparent)</span>
              </label>
              <ImageUploader
                value={values.logo.white}
                onChange={(url) => set("logo", { ...values.logo, white: url })}
                altText={logoLightAlt}
                onAltTextChange={setLogoLightAlt}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Dark Logo{" "}
                <span className="font-normal text-zinc-400">(colored / dark)</span>
              </label>
              <ImageUploader
                value={values.logo.black}
                onChange={(url) => set("logo", { ...values.logo, black: url })}
                altText={logoDarkAlt}
                onAltTextChange={setLogoDarkAlt}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Description ───────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Description
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Shown below the logo in the footer's first column.
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

        {/* ── Pages Links ───────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Pages Column
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Section Title
              </label>
              <input
                className={inputClass}
                value={values.pages.title}
                placeholder="Our Pages"
                onChange={(e) => setNested("pages", "title", e.target.value)}
              />
            </div>
            <LinkListEditor
              links={values.pages.links}
              onChange={(links) => setNested("pages", "links", links)}
            />
          </CardContent>
        </Card>

        {/* ── Services Links ────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Services Column
            </h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Section Title
              </label>
              <input
                className={inputClass}
                value={values.services.title}
                placeholder="Our Services"
                onChange={(e) => setNested("services", "title", e.target.value)}
              />
            </div>
            <LinkListEditor
              links={values.services.links}
              onChange={(links) => setNested("services", "links", links)}
            />
          </CardContent>
        </Card>

        {/* ── Social Links (title only — links moved to SiteConfig) ─────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Social Links Section
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
                placeholder="Follow Us on"
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

        {/* ── Newsletter ────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Newsletter</h2>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Heading
              </label>
              <input
                className={inputClass}
                value={values.newsLater.title}
                placeholder="Subscribe to our newsletter:"
                onChange={(e) => setNested("newsLater", "title", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Input Placeholder
              </label>
              <input
                className={inputClass}
                value={values.newsLater.placeholder}
                placeholder="Enter your email…"
                onChange={(e) => setNested("newsLater", "placeholder", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Receiver Email
              </label>
              <input
                type="email"
                className={inputClass}
                value={values.newsLater.formMail}
                placeholder="newsletter@example.com"
                onChange={(e) => setNested("newsLater", "formMail", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Bouncing Text ─────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Bouncing Text
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Large animated CTA text shown above the copyright bar.
            </p>
          </CardHeader>
          <CardContent>
            <input
              className={inputClass}
              value={values.bounchingTxt}
              placeholder="Contact Us"
              onChange={(e) => set("bounchingTxt", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* ── Copyright ─────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Copyright</h2>
          </CardHeader>
          <CardContent className="grid gap-3">
            <input
              className={inputClass}
              value={values.copyrightTxt}
              placeholder="© Dynamic Webtricker. All rights reserved."
              onChange={(e) => set("copyrightTxt", e.target.value)}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Use the word <span className="font-semibold text-amber-500">Dynamic</span> where you
              want the current year to appear automatically.
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
