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

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy Description page. this is the main page where will show all Privacy Policy information",
};

// Main component for the single blog page
export default async function PrivacyPolicyPage() {
  const data = await getPrivacyPolicyPageData();

  if (!data._id) {
    return (
      <ConditionalReturnContainer>
        <p>No Data Found</p>
      </ConditionalReturnContainer>
    );
  }
  return (
    <main>
      <section
        className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
      >
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              {data?.title}
            </h1>
          </div>
        </Container>
        <Image
          width={1800}
          height={900}
          src={bannerImg?.src}
          className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
          alt="Privacy policy Banner Image"
        />
      </section>
      <div className="max-w-[900px] mx-auto px-4">
        <Container className="w-full">
          <h1 className="wt_fs-4xl my-20">{data.title}</h1>
          <p className="my-3">{data.description}</p>
        </Container>
        <section className="w-full wt_parser_content mt-20">
          <BlogPageContainer>
            <HtmlContentParser htmlContent={data?.content} />
          </BlogPageContainer>
        </section>
      </div>
    </main>
  );
}
