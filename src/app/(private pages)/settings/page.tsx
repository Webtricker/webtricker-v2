"use client";

import {
  BriefcaseIcon,
  FileTextIcon,
  ImageIcon,
  SendIcon,
  UserPlusIcon,
  UsersIcon,
  WrenchIcon,
} from "@/dashboard/icons";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@/dashboard/ui";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StatConfig = {
  label: string;
  endpoint: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const stats: StatConfig[] = [
  {
    label: "Total Blog Posts",
    endpoint: "/api/blogs",
    Icon: FileTextIcon,
  },
  {
    label: "Total Portfolio Items",
    endpoint: "/api/portfolios",
    Icon: BriefcaseIcon,
  },
  {
    label: "Total Services",
    endpoint: "/api/services",
    Icon: WrenchIcon,
  },
  {
    label: "Total Team Members",
    endpoint: "/api/teams",
    Icon: UsersIcon,
  },
];

const quickActions = [
  {
    label: "✏️ New Blog Post",
    href: "/settings/blogs/add",
    Icon: FileTextIcon,
  },
  {
    label: "🖼️ Add Portfolio Item",
    href: "/settings/portfolios/add",
    Icon: ImageIcon,
  },
  {
    label: "📤 Upload Media",
    href: "/settings/media",
    Icon: SendIcon,
  },
  {
    label: "👤 Add Team Member",
    href: "/settings/teams/add",
    Icon: UserPlusIcon,
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour <= 17) return "Good afternoon";
  return "Good evening";
};

const getCountFromResponse = (data: unknown) => {
  if (!data || typeof data !== "object") return 0;

  const record = data as Record<string, unknown>;
  const possibleArrays = [
    record.blogs,
    record.posts,
    record.portfolios,
    record.services,
    record.teamData,
    record.data,
  ];

  const matchedArray = possibleArrays.find(Array.isArray);
  if (matchedArray) return matchedArray.length;

  const total = (record.pagination as { total?: unknown } | undefined)?.total;
  return typeof total === "number" ? total : 0;
};

export default function SettingsPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      const entries = await Promise.all(
        stats.map(async (item) => {
          try {
            const response = await fetch(item.endpoint);
            if (!response.ok) return [item.label, 0] as const;
            const data = await response.json();
            return [item.label, getCountFromResponse(data)] as const;
          } catch {
            return [item.label, 0] as const;
          }
        })
      );

      if (mounted) {
        setCounts(Object.fromEntries(entries));
        setLoading(false);
      }
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section>
        <h1 className="!text-2xl font-semibold !leading-tight text-zinc-950 dark:text-zinc-50">
          {greeting}, Admin
        </h1>
        <p className="mt-2 max-w-2xl !text-sm text-zinc-500 dark:text-zinc-400">
          Manage Webtricker content, media, settings, and future SEO tools from
          one clean workspace.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        {stats.map(({ label, Icon }) => (
          <Card
            key={label}
            className="transition duration-200 hover:-translate-y-0.5"
          >
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <Icon className="h-5 w-5 text-[#4F46E5]" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <p className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {counts[label] ?? 0}
                </p>
              )}
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {label}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map(({ label, href, Icon }) => (
          <Button key={href} asChild variant="secondary">
            <Link href={href}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </Button>
        ))}
      </section>

      <section>
        <h2 className="!text-lg font-semibold !leading-tight text-zinc-950 dark:text-zinc-50">
          Recent Activity
        </h2>
        <div className="mt-3 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        <p className="mt-4 !text-sm text-zinc-500 dark:text-zinc-400">
          Activity log will appear here in Phase 2.
        </p>
      </section>
    </div>
  );
}
