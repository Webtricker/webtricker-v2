import React from "react";
import PrivateSidebar from "./components/PrivateSidebar";
import PrivateNavbar from "./components/PrivateNavbar";
import CheckAccessToken from "./components/CheckAccessToken";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-start">
      <PrivateSidebar />
      <div className="grow h-full flex flex-col">
        <PrivateNavbar />
        {children}
      </div>

      <CheckAccessToken />
    </div>
  );
}
