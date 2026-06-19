"use client";

import DemoThemeToggler from "@/tests/DemoThemeToggler";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getCurrentDashboardUser, getRoleBadgeClass } from "./auth";
import { Badge } from "./ui";
import { MenuIcon } from "./icons";

export default function DashboardTopBar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const currentUser = getCurrentDashboardUser();
  const userName = currentUser?.name || "Admin";
  const userRole = currentUser?.role || "admin";
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 text-zinc-100 md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="rounded-md border border-zinc-800 p-2 text-zinc-100 hover:bg-zinc-800 lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <nav className="flex min-w-0 items-center gap-2 text-sm text-zinc-400">
          {segments.map((segment, index) => (
            <span key={`${segment}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-zinc-600">/</span>}
              <span
                className={
                  index === segments.length - 1
                    ? "truncate font-medium text-zinc-100"
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
        <div className="[&_svg]:brightness-0 [&_svg]:invert">
          <DemoThemeToggler />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((value) => !value)}
            className="flex items-center gap-2 rounded-md border border-transparent p-1 transition hover:border-zinc-800 hover:bg-zinc-900"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={userName}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-950">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden max-w-32 truncate text-sm font-medium text-zinc-100 md:inline">
              {userName}
            </span>
            <Badge className={`hidden sm:inline-flex ${getRoleBadgeClass(userRole)}`}>
              {userRole}
            </Badge>
          </button>
          {userMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 rounded-md border border-zinc-800 bg-zinc-950 p-1 shadow-lg"
            >
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-zinc-100 transition hover:bg-zinc-800"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
