import LegalStudio from "@/studio/pages/LegalStudio";
// app/blog/[slug]/page.tsx
import React from "react";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import { getPrivacyPolicyPageData } from "@/utils/pageData";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import { Metadata } from "next";
import Container from "@/sharedComponets/ui/wrapper/Container";
import Image from "next/image";
import bannerImg from "@/assets/images/policy-terms/privacy-policy-bg.webp";

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how Webtricker collects, uses and protects your personal information when you use our website and services.",
  alternates: { canonical: "https://webtricker.com/privacy-policy" },
};

// Main component for the single blog page
export default async function Page() {
  const data = await getPrivacyPolicyPageData();
  if (!data?._id) {
    return (
      <main className="page"><section className="pagehead"><div className="wrap"><h1 className="h-xl">No Data Found</h1></div></section></main>
    );
  }
  return <LegalStudio data={data} page="privacy" />;
}
