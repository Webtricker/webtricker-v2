import LegalStudio from "@/studio/pages/LegalStudio";
// app/blog/[slug]/page.tsx
import React from "react";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import { getTermsAndConditionPageData } from "@/utils/pageData";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import { Metadata } from "next";
import Container from "@/sharedComponets/ui/wrapper/Container";
import bannerImg from "@/assets/images/policy-terms/terms-and-contions.webp";
import Image from "next/image";

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions Description page. this is the main page where will show all Terms and Conditions information",
};

// Main component for the single blog page
export default async function Page() {
  const data = await getTermsAndConditionPageData();
  if (!data?._id) {
    return (
      <main className="page"><section className="pagehead"><div className="wrap"><h1 className="h-xl">No Data Found</h1></div></section></main>
    );
  }
  return <LegalStudio data={data} page="terms" />;
}
