"use client";

import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Weights = {
  basicSeo: number;
  contentQuality: number;
  linksStructure: number;
  aeo: number;
  geo: number;
};

type Thresholds = {
  minWordCount: number;
  goodWordCount: number;
  minSeoTitleLength: number;
  maxSeoTitleLength: number;
  minMetaDescLength: number;
  maxMetaDescLength: number;
  firstParaMinWords: number;
  tldrMaxWords: number;
  freshnessMonths: number;
};

type SeoConfigData = {
  weights: Weights;
  thresholds: Thresholds;
  lastReviewed?: string | null;
};

const defaultConfig: SeoConfigData = {
  weights: {
    basicSeo: 35,
    contentQuality: 20,
    linksStructure: 10,
    aeo: 20,
    geo: 15,
  },
  thresholds: {
    minWordCount: 300,
    goodWordCount: 600,
    minSeoTitleLength: 30,
    maxSeoTitleLength: 60,
    minMetaDescLength: 120,
    maxMetaDescLength: 160,
    firstParaMinWords: 20,
    tldrMaxWords: 50,
    freshnessMonths: 6,
  },
  lastReviewed: null,
};

function NumberField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {label}
      </label>
      {hint && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      )}
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-h-10 w-40 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
      />
    </div>
  );
}

export default function SeoConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<SeoConfigData>(defaultConfig);

  useEffect(() => {
    let mounted = true;
    fetch("/api/seo-config", { credentials: "include" })
      .then((res) => res.json())
      .then((json) => {
        if (mounted && json?.data) {
          setConfig({
            weights: { ...defaultConfig.weights, ...json.data.weights },
            thresholds: { ...defaultConfig.thresholds, ...json.data.thresholds },
            lastReviewed: json.data.lastReviewed ?? null,
          });
        }
      })
      .catch(() => toast.error("Failed to load SEO config"))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const weightTotal =
    config.weights.basicSeo +
    config.weights.contentQuality +
    config.weights.linksStructure +
    config.weights.aeo +
    config.weights.geo;

  const setWeight = (key: keyof Weights, value: number) =>
    setConfig((c) => ({ ...c, weights: { ...c.weights, [key]: value } }));

  const setThreshold = (key: keyof Thresholds, value: number) =>
    setConfig((c) => ({ ...c, thresholds: { ...c.thresholds, [key]: value } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/seo-config", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weights: config.weights,
          thresholds: config.thresholds,
          lastReviewed: config.lastReviewed,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Save failed");
      toast.success("SEO config saved");
    } catch (err: any) {
      toast.error(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkReviewed = async () => {
    const today = new Date().toISOString();
    setConfig((c) => ({ ...c, lastReviewed: today }));
    setSaving(true);
    try {
      const res = await fetch("/api/seo-config", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastReviewed: today }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed");
      toast.success("Marked as reviewed today");
    } catch (err: any) {
      toast.error(err?.message || "Failed to mark reviewed");
    } finally {
      setSaving(false);
    }
  };

  const formatReviewed = (iso: string | null | undefined) => {
    if (!iso) return "Never reviewed";
    return `Last reviewed: ${new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-6 h-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            SEO Scoring Config
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {formatReviewed(config.lastReviewed)}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleMarkReviewed}
          disabled={saving}
        >
          Mark reviewed today
        </Button>
      </div>

      {/* Scoring Weights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Scoring Weights
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                Points per category — should sum to 100.
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${
                weightTotal === 100
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}
            >
              Total: {weightTotal}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Basic SEO"
              hint="keyword, title, meta, slug, OG image"
              value={config.weights.basicSeo}
              onChange={(v) => setWeight("basicSeo", v)}
            />
            <NumberField
              label="Content Quality"
              hint="word count, headings, image alt"
              value={config.weights.contentQuality}
              onChange={(v) => setWeight("contentQuality", v)}
            />
            <NumberField
              label="Links & Structure"
              hint="internal links, external links, headings"
              value={config.weights.linksStructure}
              onChange={(v) => setWeight("linksStructure", v)}
            />
            <NumberField
              label="AEO (Answer Engine)"
              hint="Q&A headings, direct answer, FAQ, TL;DR"
              value={config.weights.aeo}
              onChange={(v) => setWeight("aeo", v)}
            />
            <NumberField
              label="GEO (Generative Engine)"
              hint="author, freshness, brand, citations"
              value={config.weights.geo}
              onChange={(v) => setWeight("geo", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Thresholds */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Thresholds
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Numeric limits used by the scoring rules.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Min word count"
              hint="below this → partial content score"
              value={config.thresholds.minWordCount}
              onChange={(v) => setThreshold("minWordCount", v)}
            />
            <NumberField
              label="Good word count"
              hint="at or above → full content length score"
              value={config.thresholds.goodWordCount}
              onChange={(v) => setThreshold("goodWordCount", v)}
            />
            <NumberField
              label="SEO title min length"
              value={config.thresholds.minSeoTitleLength}
              onChange={(v) => setThreshold("minSeoTitleLength", v)}
            />
            <NumberField
              label="SEO title max length"
              value={config.thresholds.maxSeoTitleLength}
              onChange={(v) => setThreshold("maxSeoTitleLength", v)}
            />
            <NumberField
              label="Meta description min length"
              value={config.thresholds.minMetaDescLength}
              onChange={(v) => setThreshold("minMetaDescLength", v)}
            />
            <NumberField
              label="Meta description max length"
              value={config.thresholds.maxMetaDescLength}
              onChange={(v) => setThreshold("maxMetaDescLength", v)}
            />
            <NumberField
              label="First paragraph min words"
              hint="direct answer check"
              value={config.thresholds.firstParaMinWords}
              onChange={(v) => setThreshold("firstParaMinWords", v)}
            />
            <NumberField
              label="TL;DR max words"
              hint="summary opener check"
              value={config.thresholds.tldrMaxWords}
              onChange={(v) => setThreshold("tldrMaxWords", v)}
            />
            <NumberField
              label="Freshness window (months)"
              hint="updatedAt within this → GEO freshness pass"
              value={config.thresholds.freshnessMonths}
              onChange={(v) => setThreshold("freshnessMonths", v)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Config"}
        </Button>
      </div>
    </div>
  );
}
