// app/blog/[slug]/page.tsx
import React from "react";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import { getTermsAndConditionPageData } from "@/utils/pageData";
import ConditionalReturnContainer from "@/sharedComponets/ui/wrapper/ConditionalReturnContainer";
import { Metadata } from "next";
import Container from "@/sharedComponets/ui/wrapper/Container";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions Description page. this is the main page where will show all Terms and Conditions information",
};

// Main component for the single blog page
export default async function TermsAndConditionPage() {
  const data = await getTermsAndConditionPageData();

  if (!data._id) {
    return (
      <ConditionalReturnContainer>
        <p>No Data Found</p>
      </ConditionalReturnContainer>
    );
  }
  return (
    <main className="max-w-[900px] px-4 mx-auto z-0 section-speacing mt-40 post-details-container">
      <Container className="w-full">
        <h1 className="wt_fs-4xl my-20">{data.title}</h1>
        <p className="my-3">{data.description}</p>
      </Container>
      <section className="w-full wt_parser_content mt-20">
        <BlogPageContainer>
          <HtmlContentParser htmlContent={data?.content} />
        </BlogPageContainer>
      </section>
    </main>
  );
}
