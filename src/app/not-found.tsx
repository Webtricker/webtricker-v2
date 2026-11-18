import type { Metadata } from "next";
import NotPageFound from "@/sharedComponets/ui/wrapper/NotPageFound";
import React from "react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotPageFound />;
}
