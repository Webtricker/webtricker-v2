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
import { useCurrentDashboardUser } from "@/dashboard/auth";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type StatConfig = {
  label: string;
  endpoint: string;
  Icon: React.ComponentType<{ className?: string }>;
};

type StatValue = {
  count: number;
  loading: boolean;
  error: boolean;
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
  {
    label: "Total Users",
    endpoint: "/api/users",
    Icon: UserPlusIcon,
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
    record.users,
    record.data,
  ];

  const matchedArray = possibleArrays.find(Array.isArray);
  if (matchedArray) return matchedArray.length;

  const total = (record.pagination as { total?: unknown } | undefined)?.total;
  return typeof total === "number" ? total : 0;
};

const createInitialStatState = () =>
  Object.fromEntries(
    stats.map((stat) => [
      stat.label,
      {
        count: 0,
        loading: true,
        error: false,
      },
    ])
  ) as Record<string, StatValue>;

export default function SettingsPage() {
  const [statState, setStatState] = useState<Record<string, StatValue>>(
    createInitialStatState
  );
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const greeting = useMemo(() => getGreeting(), []);
  const { user: currentUser, loading: userLoading } = useCurrentDashboardUser();
  const userName = userLoading ? "..." : currentUser?.name || "Admin";

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadStats = async () => {
      const entries = await Promise.all(
        stats.map(async (item) => {
          try {
            const response = await fetch(item.endpoint, {
              credentials: "include",
              signal: controller.signal,
            });
            if (!response.ok) {
              throw new Error(`Failed to load ${item.label}`);
            }
            const data = await response.json();
            return [
              item.label,
              {
                count: getCountFromResponse(data),
                loading: false,
                error: false,
              },
            ] as const;
          } catch {
            return [
              item.label,
              {
                count: 0,
                loading: false,
                error: true,
              },
            ] as const;
          }
        })
      );

      if (!cancelled) {
        setStatState(Object.fromEntries(entries));
      }
    };

    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/activity-logs', { 
          credentials: "include", 
          signal: controller.signal 
        });
        if (response.ok) {
          const data = await response.json();
          if (!cancelled) setLogs(data.logs || []);
        }
      } catch (err) {
        console.error("Failed to load logs", err);
      } finally {
        if (!cancelled) setLoadingLogs(false);
      }
    };

    loadStats();
    fetchLogs();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">
      <section className="!bg-transparent pb-5">
        <h1 className="!text-2xl font-semibold !leading-tight text-zinc-950 dark:text-zinc-50">
          {greeting}, {userName}
        </h1>
        <p className="mt-2 max-w-2xl !text-sm text-zinc-500 dark:text-zinc-400">
          Manage Webtricker content, media, settings, and future SEO tools from
          one clean workspace.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
        {stats.map(({ label, Icon }) => {
          const stat = statState[label] || {
            count: 0,
            loading: true,
            error: false,
          };

          return (
          <Card
            key={label}
            className="transition duration-200 hover:-translate-y-0.5"
          >
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <Icon className="h-5 w-5 text-[#4F46E5]" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-9 w-20" />
              ) : stat.error ? (
                <p
                  className="text-3xl font-semibold text-zinc-400 dark:text-zinc-500"
                  title={`${label} failed to load`}
                >
                  -
                </p>
              ) : (
                <p className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {stat.count}
                </p>
              )}
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {label}
              </p>
            </CardContent>
          </Card>
          );
        })}
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

      <section className="!bg-transparent pt-[30px]">
        <h2 className="!text-lg font-semibold !leading-tight text-zinc-950 dark:text-zinc-50">
          Recent Activity
        </h2>
        <div className="mt-3 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        
        {loadingLogs ? (
          <div className="mt-4 space-y-3">
             <Skeleton className="h-16 w-full rounded-lg" />
             <Skeleton className="h-16 w-full rounded-lg" />
             <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : logs.length === 0 ? (
          <p className="mt-4 !text-sm text-zinc-500 dark:text-zinc-400">
            No recent activity found.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3 max-h-[1050px] overflow-y-auto custom-scrollbar pr-2">
            {logs.map((log: any) => (
              <div key={log._id} className="flex items-start gap-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-lg">
                  {log.action === 'CREATE' ? '+' : log.action === 'UPDATE' ? '✎' : log.action === 'DELETE' ? '×' : '•'}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    <span className="font-semibold">{log.userEmail}</span> {log.action.toLowerCase()} {log.resource}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {log.details} • {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
