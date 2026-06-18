"use client";

import DemoThemeToggler from "@/tests/DemoThemeToggler";
import { usePathname } from "next/navigation";
import { Badge } from "./ui";
import { MenuIcon } from "./icons";

export default function DashboardTopBar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="rounded-md border border-zinc-200 p-2 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900 lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <nav className="flex min-w-0 items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          {segments.map((segment, index) => (
            <span key={`${segment}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-zinc-300">/</span>}
              <span
                className={
                  index === segments.length - 1
                    ? "truncate font-medium text-zinc-950 dark:text-zinc-50"
                    : "truncate"
                }
              >
                {segment}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <DemoThemeToggler />
        <div className="hidden items-center gap-2 sm:flex">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950">
            A
          </div>
          <Badge>Admin</Badge>
        </div>
      </div>
    </header>
  );
}
