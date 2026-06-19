"use client";

import webtrickerLogo from "@/assets/images/home/webtricker-white.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, type WheelEvent } from "react";
import { useCurrentDashboardUser } from "./auth";
import { dashboardNav } from "./dashboardNav";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "./icons";

type DashboardSidebarProps = {
  collapsed: boolean;
  open: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

const isActivePath = (pathname: string, href: string) => {
  if (href === "/settings") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
};

const getVisibleNav = (role: string) => {
  if (role === "superAdmin" || role === "admin") return dashboardNav;

  const allowedGroups =
    role === "editor"
      ? ["", "Content", "Pages", "Site Settings", "Media"]
      : role === "intern"
        ? ["Content"]
        : [];

  return dashboardNav.filter((group) => allowedGroups.includes(group.label));
};

export default function DashboardSidebar({
  collapsed,
  open,
  onClose,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const { user: currentUser } = useCurrentDashboardUser();
  const visibleNav = currentUser ? getVisibleNav(currentUser.role) : [];

  const handleSidebarWheel = (event: WheelEvent<HTMLElement>) => {
    const nav = navRef.current;
    if (!nav || nav.scrollHeight <= nav.clientHeight) return;

    const delta =
      event.deltaMode === 1
        ? event.deltaY * 16
        : event.deltaMode === 2
          ? event.deltaY * nav.clientHeight
          : event.deltaY;

    event.preventDefault();
    event.stopPropagation();
    nav.scrollTop += delta;
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        onWheelCapture={handleSidebarWheel}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-zinc-800 bg-zinc-950 text-zinc-100 transition-all duration-200 ${
          collapsed ? "w-16" : "w-[240px]"
        } ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex h-screen min-h-0 w-full flex-col bg-zinc-950">
          <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-zinc-800 px-3">
            <Link
              href="/settings"
              className="flex min-w-0 items-center"
              onClick={onClose}
            >
              <Image
                src={webtrickerLogo}
                alt="Webtricker"
                priority
                className={
                  collapsed
                    ? "h-auto w-10 object-contain"
                    : "h-auto w-[170px] object-contain"
                }
              />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <nav
            ref={navRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visibleNav.map((group) => (
              <div key={group.label} className="mb-5">
                {group.label && !collapsed && (
                  <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    {group.label}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.href
                      ? isActivePath(pathname, item.href)
                      : false;

                    if (item.disabled || !item.href) {
                      return (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-sm text-zinc-600"
                          title={collapsed ? item.label : undefined}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.label}</span>}
                        </div>
                      );
                    }

                    if (item.href === "/settings") {
                      return (
                        <div
                          key={item.href}
                          className={`flex items-center rounded-md border-l-2 text-sm transition ${
                            active
                              ? "border-[#4F46E5] bg-zinc-700 text-white"
                              : "border-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          }`}
                        >
                          <Link
                            href={item.href}
                            onClick={onClose}
                            title={collapsed ? item.label : undefined}
                            className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!collapsed && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </Link>
                          <button
                            type="button"
                            onClick={onToggleCollapse}
                            className="grid h-8 w-8 shrink-0 place-items-center text-zinc-300 transition hover:text-white"
                            aria-label="Toggle sidebar collapse"
                          >
                            {collapsed ? (
                              <ChevronRightIcon className="h-4 w-4" />
                            ) : (
                              <ChevronLeftIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition ${
                          active
                            ? "border-[#4F46E5] bg-zinc-700 text-white"
                            : "border-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="flex-shrink-0 border-t border-zinc-800 bg-zinc-950 p-2" />
        </div>
      </aside>
    </>
  );
}
