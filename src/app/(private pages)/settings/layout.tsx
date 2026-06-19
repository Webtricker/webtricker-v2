import DashboardShell from "@/dashboard/DashboardShell";
import React from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>
        {`
          .whatsApp-chat{display:none!important;}
          .dashboard-shell h1{font-size:35px!important;line-height:42px!important;}
          .dashboard-shell h2{font-size:28px!important;line-height:34px!important;}
          .dashboard-shell h3{font-size:24px!important;line-height:30px!important;}
        `}
      </style>
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
