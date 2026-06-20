"use client";

import DataTable from "@/dashboard/DataTable";
import { Badge, Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TechnologyOption = { _id: string; name: string };
type TagOption = { id: string; name: string; color?: string };

type PortfolioRecord = {
  id: string;
  _id: string;
  title: string;
  slug: string;
  thumnail?: { url?: string };
  technology?: TechnologyOption;
  tags?: TagOption[];
  liveLink?: string;
  seoScore?: number;
  updatedAt?: string;
  createdAt?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

export default function PortfoliosPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyOption[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [technologyFilter, setTechnologyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const loadOptions = async () => {
    const [technologiesResponse, tagsResponse] = await Promise.all([
      fetch("/api/portfolio-technologies", { credentials: "include" }),
      fetch("/api/tags", { credentials: "include" }),
    ]);
    const technologiesData = await technologiesResponse.json();
    const tagsData = await tagsResponse.json();

    setTechnologies(technologiesData.technologies || []);
    setTags(tagsData.tags || []);
  };

  const loadPortfolios = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({ limit: "100" });
      if (technologyFilter) params.set("technologyId", technologyFilter);
      if (tagFilter) params.set("tag", tagFilter);

      const response = await fetch(`/api/portfolios?${params.toString()}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load portfolios");
      }

      setPortfolios(data.portfolios || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load portfolios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    loadPortfolios();
  }, [technologyFilter, tagFilter]);

  const columns = useMemo(
    () => [
      {
        key: "thumnail" as const,
        label: "Thumbnail",
        render: (portfolio: PortfolioRecord) =>
          portfolio.thumnail?.url ? (
            <img
              src={portfolio.thumnail.url}
              alt={portfolio.title}
              className="h-12 w-16 rounded-md object-cover"
            />
          ) : (
            <div className="h-12 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          ),
      },
      {
        key: "title" as const,
        label: "Title",
        render: (portfolio: PortfolioRecord) => (
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {portfolio.title}
          </span>
        ),
      },
      {
        key: "technology" as const,
        label: "Technology",
        render: (portfolio: PortfolioRecord) =>
          portfolio.technology?.name ? <Badge>{portfolio.technology.name}</Badge> : "-",
      },
      {
        key: "tags" as const,
        label: "Tags",
        render: (portfolio: PortfolioRecord) => {
          const visibleTags = (portfolio.tags || []).slice(0, 2);
          const extraCount = Math.max(
            0,
            (portfolio.tags || []).length - visibleTags.length
          );

          return (
            <div className="flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <Badge key={tag.id || tag.name}>{tag.name}</Badge>
              ))}
              {extraCount > 0 && <Badge>+{extraCount} more</Badge>}
            </div>
          );
        },
      },
      {
        key: "id" as const,
        label: "SEO Score",
        render: (portfolio: PortfolioRecord) => {
          const s = portfolio.seoScore;
          if (s == null) return <span className="text-zinc-400">—</span>;
          const color =
            s >= 80
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : s >= 51
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
          return (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}>
              {s}
            </span>
          );
        },
      },
      {
        key: "updatedAt" as const,
        label: "Last Updated",
        render: (portfolio: PortfolioRecord) =>
          formatDate(portfolio.updatedAt || portfolio.createdAt),
      },
    ],
    []
  );

  const handleDelete = async (portfolio: PortfolioRecord) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolio._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete portfolio");
      }

      setPortfolios((current) => current.filter((item) => item._id !== portfolio._id));
      toast.success("Portfolio deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete portfolio");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Portfolio
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage case studies, technology taxonomy, media, and SEO metadata.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/portfolios/add">New Portfolio</Link>
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2">
        <select
          value={technologyFilter}
          onChange={(event) => setTechnologyFilter(event.target.value)}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All technologies</option>
          {technologies.map((technology) => (
            <option key={technology._id} value={technology._id}>
              {technology.name}
            </option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(event) => setTagFilter(event.target.value)}
          className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable<PortfolioRecord>
        columns={columns}
        data={portfolios}
        loading={loading}
        onEdit={(portfolio) => router.push(`/settings/portfolios/${portfolio.slug}`)}
        onDelete={handleDelete}
        emptyMessage="No portfolio items found. Create your first project."
      />
    </div>
  );
}
