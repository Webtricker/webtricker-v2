"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { scoreSeo } from "./scoreSeo";
import type { SeoConfigData } from "@/models/SeoConfig";

// ── Colour helpers ───────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-700 dark:text-green-400";
  if (score >= 51) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
  if (score >= 51) return "bg-amber-100 dark:bg-amber-900/30";
  return "bg-red-100 dark:bg-red-900/30";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 51) return "Needs work";
  return "Poor";
}

// ── Shared score badge ────────────────────────────────────────────────────────

export function SeoScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-semibold ${scoreBg(score)} ${scoreColor(score)}`}
    >
      {score}/100 · {scoreLabel(score)}
    </span>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export type SEOScorePanelProps = {
  mode?: "full" | "metadata-only";
  /** Form values (full mode: seoTitle, seoDescription, focusKeyword, canonicalUrl, ogImage, content, author) */
  values?: Record<string, any>;
  /** updatedAt from DB – used for GEO freshness check */
  updatedAt?: Date | string | null;
  /** Called with the current numeric score whenever it recomputes */
  onScoreComputed?: (score: number) => void;
  /** metadata-only: total visible section count (Home/About block editors) */
  sectionCount?: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  basicSeo: "Basic SEO",
  contentQuality: "Content Quality",
  linksStructure: "Links & Structure",
  aeo: "AEO (Answer Engine)",
  geo: "GEO (Generative Engine)",
};

export default function SEOScorePanel({
  mode = "full",
  values = {},
  updatedAt,
  onScoreComputed,
  sectionCount,
}: SEOScorePanelProps) {
  const [seoConfig, setSeoConfig] = useState<SeoConfigData | null>(null);
  const [brandName, setBrandName] = useState("");
  const [jsonLdEnabled, setJsonLdEnabled] = useState(false);
  const onScoreComputedRef = useRef(onScoreComputed);
  onScoreComputedRef.current = onScoreComputed;

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch("/api/seo-config", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/site-config", { credentials: "include" }).then((r) => r.json()),
    ]).then(([seoJson, siteJson]) => {
      if (!mounted) return;
      if (seoJson?.data) setSeoConfig(seoJson.data);
      if (siteJson?.data?.brand?.name) setBrandName(siteJson.data.brand.name);
      if (siteJson?.data?.schemaConfig?.organizationJsonLdEnabled != null)
        setJsonLdEnabled(siteJson.data.schemaConfig.organizationJsonLdEnabled);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // ── Full mode scoring ──────────────────────────────────────────────
  const fullResult = useMemo(() => {
    if (mode !== "full" || !seoConfig) return null;
    return scoreSeo(
      {
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        focusKeyword: values.focusKeyword,
        canonicalUrl: values.canonicalUrl,
        ogImage: values.ogImage,
        content: values.content,
        author: values.author,
        updatedAt,
      },
      seoConfig.weights,
      seoConfig.thresholds,
      brandName
    );
  }, [mode, values, updatedAt, seoConfig, brandName]);

  useEffect(() => {
    if (fullResult && onScoreComputedRef.current)
      onScoreComputedRef.current(fullResult.score);
  }, [fullResult]);

  // ── metadata-only scoring ──────────────────────────────────────────
  const metaResult = useMemo(() => {
    if (mode !== "metadata-only") return null;
    const title =
      String(values.title || values.bannerLargeText || values.branding || "").trim();
    const description = String(
      values.description || values.seoDescription || values.branding || ""
    ).trim();

    const checks = [
      {
        key: "title",
        label: "Page heading set",
        pass: title.length > 0,
        earned: title.length > 0 ? 35 : 0,
        max: 35,
      },
      {
        key: "description",
        label: "Page description / sub-heading set",
        pass: description.length > 0 && description !== title,
        earned: description.length > 0 && description !== title ? 25 : 0,
        max: 25,
      },
      {
        key: "jsonLd",
        label: "Organization JSON-LD active",
        pass: jsonLdEnabled,
        earned: jsonLdEnabled ? 25 : 0,
        max: 25,
      },
      {
        key: "sections",
        label:
          sectionCount !== undefined
            ? `Content blocks configured (${sectionCount})`
            : "Substantive page content",
        pass: sectionCount !== undefined ? sectionCount > 0 : true,
        earned: sectionCount !== undefined ? (sectionCount > 0 ? 15 : 0) : 15,
        max: 15,
      },
    ];
    const score = Math.min(
      100,
      Math.round(checks.reduce((s, c) => s + c.earned, 0))
    );
    return { score, checks };
  }, [mode, values, jsonLdEnabled, sectionCount]);

  const result = mode === "full" ? fullResult : metaResult;

  if (!result) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-600">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent dark:border-zinc-700" />
        Loading SEO config…
      </div>
    );
  }

  const { score, checks } = result;

  // Group full checks by category
  const byCategory = mode === "full"
    ? (["basicSeo", "contentQuality", "linksStructure", "aeo", "geo"] as const).map(
        (cat) => ({
          key: cat,
          label: CATEGORY_LABELS[cat],
          checks: (checks as typeof fullResult extends null ? never : NonNullable<typeof fullResult>["checks"]).filter(
            (c: any) => c.category === cat
          ),
        })
      )
    : null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {mode === "full" ? "SEO Score" : "Page Health"}
        </span>
        <SeoScoreBadge score={score} />
      </div>

      {/* Checklist */}
      {mode === "full" && byCategory ? (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {byCategory.map((group) => (
            <details key={group.key} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900/50">
                <span>{group.label}</span>
                <span>
                  {Math.round(group.checks.reduce((s: number, c: any) => s + c.earned, 0))}/
                  {Math.round(group.checks.reduce((s: number, c: any) => s + c.max, 0))}
                </span>
              </summary>
              <div className="grid gap-px border-t border-zinc-100 dark:border-zinc-900">
                {group.checks.map((check: any) => (
                  <div
                    key={check.key}
                    className="flex items-start gap-2 px-4 py-2 text-xs"
                  >
                    <span
                      className={`mt-px shrink-0 ${
                        check.pass
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {check.pass ? "✓" : "✗"}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="grid gap-px py-1">
          {checks.map((check: any) => (
            <div key={check.key} className="flex items-start gap-2 px-4 py-2 text-xs">
              <span
                className={`mt-px shrink-0 ${
                  check.pass
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {check.pass ? "✓" : "✗"}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">{check.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
