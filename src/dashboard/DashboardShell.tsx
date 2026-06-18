"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopBar from "./DashboardTopBar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50">
      <DashboardSidebar
        collapsed={collapsed}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />
      <div
        className={`min-h-screen transition-[padding] duration-300 ${
          collapsed ? "lg:pl-16" : "lg:pl-[240px]"
        }`}
      >
        <DashboardTopBar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="px-4 py-5 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
