"use client";

import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// ─── types ─────────────────────────────────────────────────────────────────

type OpeningHours = {
  days: string[];
  opens: string;
  closes: string;
  timezone: string;
};

type Office = {
  label: string;
  country: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  addressText: string;
  openingHours: OpeningHours[];
};

type SocialLink = {
  platform: string;
  href: string;
  isExternal: boolean;
};

type SiteConfigValues = {
  brand: {
    name: string;
    legalName: string;
    url: string;
    description: string;
    logo: string;
  };
  contact: {
    primaryEmail: string;
    emails: string[];
    primaryPhone: string;
    phones: string[];
  };
  offices: Office[];
  socialLinks: SocialLink[];
  schemaConfig: {
    businessType: "ProfessionalService";
    organizationJsonLdEnabled: boolean;
  };
};

// ─── constants ──────────────────────────────────────────────────────────────

const EMPTY_VALUES: SiteConfigValues = {
  brand: { name: "", legalName: "", url: "", description: "", logo: "" },
  contact: { primaryEmail: "", emails: [], primaryPhone: "", phones: [] },
  offices: [],
  socialLinks: [],
  schemaConfig: { businessType: "ProfessionalService", organizationJsonLdEnabled: true },
};

const EMPTY_OFFICE: Office = {
  label: "",
  country: "",
  streetAddress: "",
  locality: "",
  region: "",
  postalCode: "",
  addressText: "",
  openingHours: [],
};

const EMPTY_HOURS: OpeningHours = {
  days: [],
  opens: "09:00",
  closes: "18:00",
  timezone: "America/New_York",
};

const EMPTY_LINK: SocialLink = { platform: "facebook", href: "", isExternal: true };

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const KNOWN_PLATFORMS = ["facebook", "linkedin", "x", "instagram", "pinterest", "youtube"];

const inputClass =
  "min-h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950";

const removeBtn =
  "shrink-0 rounded-md border border-zinc-200 px-3 text-sm text-red-500 hover:bg-red-50 dark:border-zinc-800 dark:hover:bg-red-950/20";

// ─── page component ─────────────────────────────────────────────────────────

export default function SiteConfigPage() {
  const [values, setValues] = useState<SiteConfigValues>(EMPTY_VALUES);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ── load ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/site-config", { credentials: "include" });
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setValues({
            brand: {
              name: d.brand?.name ?? "",
              legalName: d.brand?.legalName ?? "",
              url: d.brand?.url ?? "",
              description: d.brand?.description ?? "",
              logo: d.brand?.logo ?? "",
            },
            contact: {
              primaryEmail: d.contact?.primaryEmail ?? "",
              emails: d.contact?.emails ?? [],
              primaryPhone: d.contact?.primaryPhone ?? "",
              phones: d.contact?.phones ?? [],
            },
            offices: d.offices ?? [],
            socialLinks: d.socialLinks ?? [],
            schemaConfig: {
              businessType: "ProfessionalService",
              organizationJsonLdEnabled: d.schemaConfig?.organizationJsonLdEnabled ?? true,
            },
          });
        }
      } catch {
        toast.error("Failed to load site config");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Save failed");
      toast.success("Site config saved");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save site config");
    } finally {
      setSubmitting(false);
    }
  };

  // ── brand ────────────────────────────────────────────────────────────────
  const setBrand = (field: keyof SiteConfigValues["brand"], value: string) =>
    setValues((v) => ({ ...v, brand: { ...v.brand, [field]: value } }));

  // ── contact scalars ──────────────────────────────────────────────────────
  const setContactField = (field: "primaryEmail" | "primaryPhone", value: string) =>
    setValues((v) => ({ ...v, contact: { ...v.contact, [field]: value } }));

  // ── contact arrays (phones / emails) ─────────────────────────────────────
  const updateContactItem = (section: "phones" | "emails", index: number, value: string) =>
    setValues((v) => {
      const arr = [...v.contact[section]];
      arr[index] = value;
      return { ...v, contact: { ...v.contact, [section]: arr } };
    });

  const addContactItem = (section: "phones" | "emails") =>
    setValues((v) => ({
      ...v,
      contact: { ...v.contact, [section]: [...v.contact[section], ""] },
    }));

  const removeContactItem = (section: "phones" | "emails", index: number) =>
    setValues((v) => ({
      ...v,
      contact: {
        ...v.contact,
        [section]: v.contact[section].filter((_, i) => i !== index),
      },
    }));

  // ── social links ──────────────────────────────────────────────────────────
  const addSocialLink = () =>
    setValues((v) => ({ ...v, socialLinks: [...v.socialLinks, { ...EMPTY_LINK }] }));

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string | boolean) =>
    setValues((v) => {
      const arr = [...v.socialLinks];
      arr[index] = { ...arr[index], [field]: value };
      return { ...v, socialLinks: arr };
    });

  const removeSocialLink = (index: number) =>
    setValues((v) => ({ ...v, socialLinks: v.socialLinks.filter((_, i) => i !== index) }));

  // ── offices ───────────────────────────────────────────────────────────────
  const addOffice = () =>
    setValues((v) => ({ ...v, offices: [...v.offices, { ...EMPTY_OFFICE }] }));

  const updateOffice = (
    index: number,
    field: keyof Omit<Office, "openingHours">,
    value: string
  ) =>
    setValues((v) => {
      const arr = [...v.offices];
      arr[index] = { ...arr[index], [field]: value };
      return { ...v, offices: arr };
    });

  const removeOffice = (index: number) =>
    setValues((v) => ({ ...v, offices: v.offices.filter((_, i) => i !== index) }));

  // ── opening hours ─────────────────────────────────────────────────────────
  const addOpeningHours = (officeIndex: number) =>
    setValues((v) => {
      const offices = [...v.offices];
      offices[officeIndex] = {
        ...offices[officeIndex],
        openingHours: [...offices[officeIndex].openingHours, { ...EMPTY_HOURS }],
      };
      return { ...v, offices };
    });

  const updateOpeningHours = (
    officeIndex: number,
    hoursIndex: number,
    field: keyof OpeningHours,
    value: string | string[]
  ) =>
    setValues((v) => {
      const offices = [...v.offices];
      const hours = [...offices[officeIndex].openingHours];
      hours[hoursIndex] = { ...hours[hoursIndex], [field]: value };
      offices[officeIndex] = { ...offices[officeIndex], openingHours: hours };
      return { ...v, offices };
    });

  const removeOpeningHours = (officeIndex: number, hoursIndex: number) =>
    setValues((v) => {
      const offices = [...v.offices];
      offices[officeIndex] = {
        ...offices[officeIndex],
        openingHours: offices[officeIndex].openingHours.filter((_, i) => i !== hoursIndex),
      };
      return { ...v, offices };
    });

  const toggleDay = (officeIndex: number, hoursIndex: number, day: string) => {
    const current = values.offices[officeIndex].openingHours[hoursIndex].days;
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    updateOpeningHours(officeIndex, hoursIndex, "days", next);
  };

  // ── schema config ─────────────────────────────────────────────────────────
  const toggleJsonLd = () =>
    setValues((v) => ({
      ...v,
      schemaConfig: {
        ...v.schemaConfig,
        organizationJsonLdEnabled: !v.schemaConfig.organizationJsonLdEnabled,
      },
    }));

  // ── render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="h-16 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-72 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-56 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Sticky page header */}
      <div className="sticky top-16 z-[25] -mx-4 flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/95 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Site Config</h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Brand identity, contact info, social links, and office locations.
          </p>
        </div>
        <button
          type="submit"
          form="site-config-form"
          disabled={submitting}
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>

      <form id="site-config-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* ── Brand ──────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Brand</h2>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <Field label="Brand Name" required>
                <input
                  className={inputClass}
                  required
                  value={values.brand.name}
                  onChange={(e) => setBrand("name", e.target.value)}
                />
              </Field>
              <Field label="Legal Name" required>
                <input
                  className={inputClass}
                  required
                  value={values.brand.legalName}
                  onChange={(e) => setBrand("legalName", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Site URL" required>
              <input
                className={inputClass}
                type="url"
                required
                value={values.brand.url}
                onChange={(e) => setBrand("url", e.target.value)}
              />
            </Field>
            <Field label="Description" required>
              <textarea
                className={`${inputClass} min-h-28 py-3`}
                required
                value={values.brand.description}
                onChange={(e) => setBrand("description", e.target.value)}
              />
            </Field>
            <Field
              label="Brand Logo URL"
              hint="Used in JSON-LD structured data only. Paste a Cloudinary URL or any public image URL."
            >
              <input
                className={inputClass}
                type="url"
                value={values.brand.logo}
                onChange={(e) => setBrand("logo", e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        {/* ── Contact ────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Contact</h2>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <Field label="Primary Phone" required>
                <input
                  className={inputClass}
                  required
                  value={values.contact.primaryPhone}
                  onChange={(e) => setContactField("primaryPhone", e.target.value)}
                />
              </Field>
              <Field label="Primary Email" required>
                <input
                  className={inputClass}
                  type="email"
                  required
                  value={values.contact.primaryEmail}
                  onChange={(e) => setContactField("primaryEmail", e.target.value)}
                />
              </Field>
            </div>

            <Field
              label="All Phone Numbers"
              hint="TopBar shows phones[0] and the first +880 number. Footer shows phones[0–2] as Phone and phones[3–5] as Hotline."
            >
              <div className="grid gap-2">
                {values.contact.phones.map((phone, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className={inputClass}
                      value={phone}
                      placeholder="+1 (555) 000-0000"
                      onChange={(e) => updateContactItem("phones", i, e.target.value)}
                    />
                    <button type="button" onClick={() => removeContactItem("phones", i)} className={removeBtn}>
                      Remove
                    </button>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => addContactItem("phones")}>
                  + Add Phone
                </Button>
              </div>
            </Field>

            <Field label="All Email Addresses" hint="All emails appear in the Footer and mobile Sidebar.">
              <div className="grid gap-2">
                {values.contact.emails.map((email, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className={inputClass}
                      type="email"
                      value={email}
                      placeholder="hello@webtricker.com"
                      onChange={(e) => updateContactItem("emails", i, e.target.value)}
                    />
                    <button type="button" onClick={() => removeContactItem("emails", i)} className={removeBtn}>
                      Remove
                    </button>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={() => addContactItem("emails")}>
                  + Add Email
                </Button>
              </div>
            </Field>
          </CardContent>
        </Card>

        {/* ── Social Links ────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Social Links</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Powers the Top Bar, Footer, and mobile Sidebar sitewide. Also auto-populates Organization Schema sameAs on save.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {values.socialLinks.map((link, i) => (
              <div
                key={i}
                className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="grid gap-1.5 min-w-[140px]">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Platform
                  </label>
                  <select
                    className={`${inputClass} !min-h-9`}
                    value={link.platform}
                    onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                  >
                    {KNOWN_PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1.5 grow min-w-[200px]">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Profile URL
                  </label>
                  <input
                    className={`${inputClass} !min-h-9`}
                    type="url"
                    value={link.href}
                    placeholder="https://..."
                    onChange={(e) => updateSocialLink(i, "href", e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    New tab
                  </label>
                  <button
                    type="button"
                    onClick={() => updateSocialLink(i, "isExternal", !link.isExternal)}
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
                <button type="button" onClick={() => removeSocialLink(i)} className={removeBtn}>
                  Remove
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addSocialLink}>
              + Add Social Link
            </Button>
          </CardContent>
        </Card>

        {/* ── Offices ─────────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Offices</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Office locations shown in the Footer and mobile Sidebar. Structured fields also populate LocalBusiness schema.
            </p>
          </CardHeader>
          <CardContent className="grid gap-5">
            {values.offices.map((office, oi) => (
              <div key={oi} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {office.label || `Office ${oi + 1}`}
                  </h3>
                  <button type="button" onClick={() => removeOffice(oi)} className="text-sm text-red-500 hover:underline">
                    Remove Office
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="Label (e.g. US Office)">
                      <input className={inputClass} value={office.label} onChange={(e) => updateOffice(oi, "label", e.target.value)} />
                    </Field>
                    <Field label="Country">
                      <input className={inputClass} value={office.country} onChange={(e) => updateOffice(oi, "country", e.target.value)} />
                    </Field>
                    <Field label="Street Address">
                      <input className={inputClass} value={office.streetAddress} onChange={(e) => updateOffice(oi, "streetAddress", e.target.value)} />
                    </Field>
                    <Field label="City / Locality">
                      <input className={inputClass} value={office.locality} onChange={(e) => updateOffice(oi, "locality", e.target.value)} />
                    </Field>
                    <Field label="State / Region">
                      <input className={inputClass} value={office.region} onChange={(e) => updateOffice(oi, "region", e.target.value)} />
                    </Field>
                    <Field label="Postal Code">
                      <input className={inputClass} value={office.postalCode} onChange={(e) => updateOffice(oi, "postalCode", e.target.value)} />
                    </Field>
                  </div>

                  <Field label="Display Address" hint="Human-readable text shown in Footer and Sidebar.">
                    <textarea
                      className={`${inputClass} py-2`}
                      value={office.addressText}
                      onChange={(e) => updateOffice(oi, "addressText", e.target.value)}
                    />
                  </Field>

                  {/* Opening hours */}
                  <div>
                    <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50 mb-3">
                      Opening Hours
                    </p>
                    <div className="grid gap-3">
                      {office.openingHours.map((hours, hi) => (
                        <div
                          key={hi}
                          className="rounded-md border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              Hours set {hi + 1}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeOpeningHours(oi, hi)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                            {ALL_DAYS.map((day) => (
                              <label key={day} className="flex items-center gap-1.5 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={hours.days.includes(day)}
                                  onChange={() => toggleDay(oi, hi, day)}
                                  className="h-3.5 w-3.5"
                                />
                                {day.slice(0, 3)}
                              </label>
                            ))}
                          </div>
                          <div className="grid gap-3 lg:grid-cols-3">
                            <Field label="Opens">
                              <input
                                className={inputClass}
                                value={hours.opens}
                                placeholder="09:00"
                                onChange={(e) => updateOpeningHours(oi, hi, "opens", e.target.value)}
                              />
                            </Field>
                            <Field label="Closes">
                              <input
                                className={inputClass}
                                value={hours.closes}
                                placeholder="18:00"
                                onChange={(e) => updateOpeningHours(oi, hi, "closes", e.target.value)}
                              />
                            </Field>
                            <Field label="Timezone">
                              <input
                                className={inputClass}
                                value={hours.timezone}
                                placeholder="America/New_York"
                                onChange={(e) => updateOpeningHours(oi, hi, "timezone", e.target.value)}
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="secondary" onClick={() => addOpeningHours(oi)}>
                        + Add Hours
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addOffice}>
              + Add Office
            </Button>
          </CardContent>
        </Card>

        {/* ── Schema / JSON-LD ─────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Organization Schema
            </h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleJsonLd}
                className={`h-6 w-11 shrink-0 rounded-full p-1 transition ${
                  values.schemaConfig.organizationJsonLdEnabled
                    ? "bg-zinc-950 dark:bg-zinc-50"
                    : "bg-zinc-300 dark:bg-zinc-800"
                }`}
              >
                <span
                  className={`block h-4 w-4 rounded-full bg-white transition dark:bg-zinc-950 ${
                    values.schemaConfig.organizationJsonLdEnabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
              <div>
                <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Enable Organization JSON-LD
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Injects structured data for Google Search. Business type: ProfessionalService.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

// ─── shared field wrapper ────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex flex-col gap-0.5">
        <label className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        {hint && <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
