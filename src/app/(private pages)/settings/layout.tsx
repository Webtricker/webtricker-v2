import DashboardShell from "@/dashboard/DashboardShell";
import React from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`.whatsApp-chat{display:none!important;}`}</style>
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
